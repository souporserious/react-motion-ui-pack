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

  _cachedDimensions = {}

  _forceUpdate = () => {
    this.forceUpdate();
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
    const { children, enter } = this.props;
    const configs = {};

    Children.forEach(children, child => {
      if(!child) return;

      const dimensions = this._cachedDimensions[child.key];
      let styles = {...enter};

      if(styles.height && enter.height.val === 'auto') {
        styles.height = {val: dimensions && dimensions.height || 0};
      }
      if(styles.width && enter.width.val === 'auto') {
        styles.width = {val: dimensions && dimensions.width || 0};
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
    return {
      ...value,
      styles: this.props.leave
    }
  }

  _childrenToRender = (currValues) => {
    return Object.keys(currValues).map(key => {
      const currValue = currValues[key];
      const { component, styles } = currValue;

      return(
        // measure child and force update to run
        // react motion again once we have dimensions
        <Measure key={key} onChange={this._forceUpdate}>
          {dimensions => {
            this._cachedDimensions[key] = dimensions;
            return cloneElement(component, {
              style: configToStyle(styles),
              dimensions
            })
          }}
        </Measure>
      );
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