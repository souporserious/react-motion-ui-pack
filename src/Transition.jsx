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

  static effects = {}

  static register(name, enter, leave) {
    Transition.effects[name] = {
      enter: enter,
      leave: leave
    };
  }

  transform = getVendorPrefix('transform')
  effect = null

  componentWillMount() {
    this._getEffect();
  }

  componentWillReceiveProps() {
    this._getEffect();
  }
  
  getEndValues(currValue) {

    let {children, appear, enter, leave, registered} = this.props;
    let configs = {}, config;

    if(registered) {
      enter = this.effect.enter;
      leave = this.effect.leave;
    }

    config = (appear && !currValue) ? leave : enter;

    Children.forEach(children, child => {
      configs[child.key] = config;
    });

    return configs;
  }

  willEnter() {
    const {leave, registered} = this.props;
    return registered ? this.effect.leave : leave;
  }

  willLeave(key, endValues, currentValue, currentSpeed) {
    if(currentValue[key].opacity.val === 0 && currentSpeed[key].opacity.val === 0) {
      return null;
    }
    const {leave, registered} = this.props;
    return registered ? this.effect.leave : leave;
  }

  _getEffect() {

    let {registered} = this.props;

    if(!registered) return;

    const effect = Transition.effects[registered];

    if(!effect) {
      throw `Effect not found. Register "${registered}" as an effect using Transition.register()`;
    }

    this.effect = effect;
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
        {(configs) =>
          <div>
            {Children.map(this.props.children, (child) => {

              const config = configs[child.key];

              if(!config) {
                return;
              }

              return cloneElement(child, {
                style: this._configToStyle(config)
              })
            })}
          </div>
        }
      </TransitionSpring>
    );
  }
}

export default Transition;