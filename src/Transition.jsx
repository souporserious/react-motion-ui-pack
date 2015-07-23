import React, { Component, PropTypes, Children, cloneElement } from 'react';
import { TransitionSpring } from 'react-motion';
import { getVendorPrefix } from './utils';

// Need to expand config to style so we can map things
// like translateY => transform: translateY()
// as well as take care of prefixing

class Transition extends Component {

  static propTypes = {
    appear: PropTypes.bool,
    enter: PropTypes.object,
    leave: PropTypes.object
  }

  static defaultProps = {
    appear: false,
    enter: {opacity: {val: 1}},
    leave: {opacity: {val: 0}}
  }

  transform = getVendorPrefix('transform')
  
  getEndValues(currValue) {

    let {children, appear, enter, leave, registered} = this.props;
    let configs = {}, dest;

    dest = (appear && !currValue) ? leave : enter;

    Children.forEach(children, component => {
      configs[component.key] = {
        component: component,
        dest: dest
      }
    });

    return configs;
  }

  willEnter(key, value, endValue, currentValue, currentSpeed) {
    
    const {leave} = this.props;

    return {
      ...value,
      dest: leave
    };
  }

  willLeave(key, value, endValue, currentValue, currentSpeed) {

    if(value.dest.opacity.val === 0 && currentSpeed[key].dest.opacity.val === 0) {
      return null;
    }
    
    const {leave} = this.props;

    return {
      ...value,
      dest: leave
    };
  }

  _configToStyle(config) {

    let styles = {};

    Object.keys(config).map(key => {

      // need a utility to take care of other scenarios
      // see about moving this outside of render method
      if(key === 'translateY') {
        styles[this.transform] = `translateY(${value}px)`;
      } else {
        styles[key] = config[key].val;
      }
    });
    return styles;
  }

  render() {
    return(
      <TransitionSpring
        endValue={::this.getEndValues}
        willEnter={::this.willEnter}
        willLeave={::this.willLeave}
      >
        {(currValues) =>
          <div>
            {Object.keys(currValues).map(key => {
              let currValue = currValues[key];
              return cloneElement(currValue.component, {
                style: this._configToStyle(currValue.dest)
              })
            })}
          </div>
        }
      </TransitionSpring>
    );
  }
}

export default Transition;