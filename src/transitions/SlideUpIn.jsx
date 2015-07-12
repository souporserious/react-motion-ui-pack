import React, { Component } from 'react';
import { TransitionSpring } from 'react-motion';

class SlideUpIn extends Component {

  static defaultProps = {
    appear: true,
    translateY: 25
  }
  
  getEndValues(currValue) {

    let translateYValue = this.props.appear && !currValue ? this.props.translateY : 0;
    let opacityValue = this.props.appear && !currValue ? 0 : 1;
    let configs = {};

    React.Children.forEach(this.props.children, child => {
      configs[child.key] = {
        translateY: {val: translateYValue},
        opacity: {val: opacityValue}
      };
    });

    return configs;
  }

  willEnter() {
    return {
      translateY: {val: this.props.translateY},
      opacity: {val: 0}
    }
  }

  willLeave(key, endValues, currentValue, currentSpeed) {
    if (currentValue[key].opacity.val === 0 && currentSpeed[key].opacity.val === 0) {
      return null; // kill component when opacity reaches 0
    }
    return {
        translateY: {val: this.props.translateY},
        opacity: {val: 0}
      }
  }

  render() {
    return(
      <TransitionSpring
        endValue={::this.getEndValues}
        willEnter={::this.willEnter}
        willLeave={::this.willLeave}
      >
        {(currValue) =>
          React.Children.map(this.props.children, (child) => {
            if(!currValue[child.key]) {
              return;
            }
            return React.cloneElement(child, {
              style: {
                WebkitTransform: `translateY(${currValue[child.key].translateY.val}px)`,
                opacity: currValue[child.key].opacity.val
              }
            })
          })
        }
      </TransitionSpring>
    );
  }
}

export default SlideUpIn;