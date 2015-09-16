import React, { Component, PropTypes, Children, cloneElement } from 'react';
import { TransitionSpring, utils } from 'react-motion';
import Measure from 'react-measure';
import getVendorPrefix from './get-vendor-prefix';

class Transition extends Component {
  static propTypes = {
    component: PropTypes.string,
    appear: PropTypes.bool,
    enter: PropTypes.object,
    leave: PropTypes.object
  }

  static defaultProps = {
    component: 'span',
    appear: true,
    enter: {
      opacity: {val: 1}
    },
    leave: {
      opacity: {val: 0}
    }
  }

  _cachedDimensions = {};
  
  componentDidMount() {    
    window.addEventListener('resize', () => {
      this.forceUpdate();
    });
  }
  
  getEndValues(currValues) {
    const { children, appear, enter, leave } = this.props;
    const configs = {};
    const dest = (appear && !currValues) ? leave : enter;

    Children.forEach(children, child => {
      if(!child) return;
      // clone dest object
      let currDest = JSON.parse(JSON.stringify(dest));
      
      if(currDest.height && dest.height.val === 'auto') {
        const dimensions = this._cachedDimensions[child.key] || {};
        const height = dimensions.height || 0;
        currDest.height = {val: height};
      }
      
      configs[child.key] = {
        component: child,
        dest: currDest
      }
    });
    return configs;
  }

  willTransition(key, value, endValue, currentValue, currentSpeed) {
    const { leave } = this.props;
    return {
      ...value,
      dest: leave
    };
  }

  _configToStyle(config) {
    let styles = {};

    Object.keys(config).map(key => {
      if(key === 'transform') {
        styles[this.transform] = config[key].val;
      } else {
        styles[key] = config[key].val;
      }
    });

    return styles;
  }

  render() {
    const childrenToRender = (currValues) => Object.keys(currValues).map(key => {
      const currValue = currValues[key];
      const { component, dest } = currValue;
      
      return(
        <Measure key={key}>
          {dimensions => {
            this._cachedDimensions[component.key] = dimensions;
            return cloneElement(component, {
              style: this._configToStyle(dest),
              dimensions
            })
          }}
        </Measure>
      );
    });

    return(
      <TransitionSpring
        endValue={this.getEndValues.bind(this)}
        willEnter={this.willTransition.bind(this)}
        willLeave={this.willTransition.bind(this)}
      >
        {currValues =>
          React.createElement(
            this.props.component,
            this.props,
            childrenToRender(currValues)
          )
        }
      </TransitionSpring>
    );
  }
}

export default Transition;