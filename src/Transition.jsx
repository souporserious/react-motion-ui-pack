import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react';
import { TransitionSpring, utils } from 'react-motion';
import Measure from 'react-measure';
import configToStyle from './config-to-style';

class Transition extends Component {
  static propTypes = {
    component: PropTypes.string,
    onlyChild: PropTypes.bool,
    appear: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ]),
    enter: PropTypes.object,
    leave: PropTypes.object
  }

  static defaultProps = {
    component: 'div', // define the wrapping tag around the elements you want to transition in/out
    onlyChild: false, // useful if you only want to transition in/out 1 element rather than a list
    appear: true, // accepts an object or boolean, if boolean passed it will use "leave" as the origin point of the transition
    enter: {
      opacity: {val: 1}
    },
    leave: {
      opacity: {val: 0}
    }
  }

  state = {
    dimensions: {}
  }

  _getDefaultValues = () => {
    const { children, appear, enter, leave } = this.props;
    let styles = enter;
    let configs = {};

    if(appear) {
      styles = (typeof appear === 'object') ? appear : leave;
    }

    Children.forEach(children, child => {
      if(!child) return;
      configs[child.key] = {
        component: child,
        styles
      }
    });

    return configs;
  }
  
  _getEndValues = (s) => {
    const { dimensions } = this.state
    const { children, enter } = this.props
    const configs = {}

    Children.forEach(children, child => {
      if(!child) return;

      const childDimensions = dimensions && dimensions[child.key];
      let styles = {...enter};

      if(styles.height && enter.height.val === 'auto') {
        styles.height = {val: childDimensions && childDimensions.height || 0};
      }
      if(styles.width && enter.width.val === 'auto') {
        styles.width = {val: childDimensions && childDimensions.width || 0};
      }

      configs[child.key] = {
        component: child,
        styles
      }
    });

    return configs
  }

  _willEnter = (key, value, endValue, currentValue, currentSpeed) => {
    const { appear, leave } = this.props
    const styles = (typeof appear === 'object') ? appear : leave

    return {
      ...value,
      styles
    }
  }

  _willLeave = (key, value, endValue, currentValue, currentSpeed) => {
    // clean up dimensions when item leaves
    delete this.state.dimensions[key]

    return {
      ...value,
      styles: this.props.leave
    }
  }

  _storeDimensions = (key, childDimensions) => {
    const { dimensions } = this.state
    dimensions[key] = childDimensions
    this.setState({dimensions})
  }

  _childrenToRender = (currValues) => {
    const { enter } = this.props

    return Object.keys(currValues).map(key => {
      const currValue = currValues[key]
      const { component, styles } = currValue
      const style = configToStyle(styles)
      let child = null;

      // if auto passed on width or height, measure component to get correct dimensions
      if(enter.width && enter.width.val === 'auto' ||
         enter.height && enter.height.val === 'auto') {
        child = React.createElement(
          Measure,
          {key, whitelist: ['width', 'height'], onChange: this._storeDimensions.bind(null, key)},
          cloneElement(component, {style, dimensions: this.state.dimensions[key]})
        )
      } else {
        child = cloneElement(component, {key, style})
      }

      return child
    });
  }

  render() {
    const { component, onlyChild, appear } = this.props;

    return(
      <TransitionSpring
        defaultValue={this._getDefaultValues()}
        endValue={this._getEndValues()}
        willEnter={this._willEnter}
        willLeave={this._willLeave}
      >
        {currValues => {
          const children = this._childrenToRender(currValues);
          let wrapper;

          if(onlyChild) {
            if(children.length === 1) {
              wrapper = Children.only(children[0])
            } else {
              wrapper = createElement(component, {style: {display: 'none'}})
            }
          } else {
            wrapper = createElement(component, this.props, children)
          }

          return wrapper;
        }}
      </TransitionSpring>
    );
  }
}

export default Transition;