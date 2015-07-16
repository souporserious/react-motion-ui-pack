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
    let configs = [], config;

    config = (appear && !currValue) ? leave : enter;

    Children.forEach(children, val => {
      configs.push({
        val: val,
        config: config
      });
    });

    return configs;
  }

  willEnter(key, endValues, currentValue, currentSpeed) {
    const {leave} = this.props;
    console.log(endValues[key]);
    endValues[key].config = leave;
    return endValues[key];
  }

  willLeave(key, endValues, currentValue, currentSpeed) {
    //if (currentValue === endValues[key]) return null else return <div />
    if(currentValue[key].opacity.val === 0 && currentSpeed[key].opacity.val === 0) {
      return null;
    }
    const {leave} = this.props;
    return leave;
  }

  _configToStyle(config) {
    
    let styles = {};

    Object.keys(config).map((key) => {

      let value = config[key].val;

      // need a utility to take care of other scenarios
      // see about moving this outside of render method
      if(key === 'translateY') {
        styles[this.transform] = `translateY(${value}px)`;
      } else {
        styles[key] = value;
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
            {currValues.map(currValue => {
              return cloneElement(currValue.val, {
                style: this._configToStyle(currValue.config)
              })
            })}
          </div>
        }
      </TransitionSpring>
    );
  }
}

export default Transition;