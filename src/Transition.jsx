import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react';
import { TransitionSpring, utils } from 'react-motion';
import Measure from 'react-measure';
import getVendorPrefix from './get-vendor-prefix';

const UNIT_TRANSFORMS = ['translateX', 'translateY', 'translateZ', 'transformPerspective'];
const DEGREE_TRANFORMS = ['rotate', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'scaleZ'];
const UNITLESS_TRANSFORMS = ['scale', 'scaleX', 'scaleY'];
const TRANSFORMS = UNIT_TRANSFORMS.concat(DEGREE_TRANFORMS, UNITLESS_TRANSFORMS);
let registeredComponents = [];

// force rerender on window resize so we can grab dimensions again
window.addEventListener('resize', () => {
  registeredComponents.forEach(c => c._forceUpdate());
});

class Transition extends Component {
  static propTypes = {
    component: PropTypes.string,
    onlyChild: PropTypes.bool,
    appear: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ]),
    enter: PropTypes.object,
    leave: PropTypes.object,
    stagger: PropTypes.bool
  }

  static defaultProps = {
    component: 'span',
    onlyChild: false,
    appear: true,
    enter: {
      opacity: {val: 1}
    },
    leave: {
      opacity: {val: 0}
    },
    stagger: false
  }

  _transform = getVendorPrefix('transform')
  _cachedDimensions = {};
  
  componentDidMount() {
    registeredComponents.push(this);
  }

  componentWillUnmount() {
    const pos = registeredComponents.indexOf(this);
    if(pos > -1) {
      registeredComponents.splice(pos, 1);
    }
  }

  _forceUpdate = () => {
    this.forceUpdate();
  }
  
  _getEndValues = (prevValues) => {
    const { children, appear, enter, leave, stagger } = this.props;
    const configs = {};
    let styles = enter;

    // check if first pass and if we need to pass an appearing transition
    if(!prevValues && appear) {
      styles = (typeof appear === 'object') ? appear : leave;
    }

    Children.forEach(children, (child, i) => {
      if(!child) return;

      const dimensions = this._cachedDimensions[child.key];
      let childStyles = {...styles};

      if(dimensions) {
        if(childStyles.height && styles.height.val === 'auto') {
          childStyles.height = {val: dimensions.height || 0};
        }
        if(childStyles.width && styles.width.val === 'auto') {
          childStyles.width = {val: dimensions.width || 0};
        }
      }

      // implement staggering and use prev values
      if(prevValues && stagger && i !== 0) {
        childStyles = prevValues[children[i-1].key].styles;
      }
      
      configs[child.key] = {
        component: child,
        styles: childStyles
      }
    });
    return configs;
  }

  _willTransition = (key, value, endValue, currentValue, currentSpeed) => {
    const { leave } = this.props;
    return {
      ...value,
      styles: leave
    };
  }

  _configToStyle(configs) {
    let styles = {};

    Object.keys(configs).map(key => {
      const isTransform = (TRANSFORMS.indexOf(key) > -1);
      const value = configs[key].val;

      if(isTransform) {
        let transformProps = styles[this._transform] || '';

        if(UNIT_TRANSFORMS.indexOf(key) > -1) {
          transformProps += `${key}(${value}px) `
        }
        else if(DEGREE_TRANFORMS.indexOf(key) > -1) {
          transformProps += `${key}(${value}deg) `
        }
        else if(UNITLESS_TRANSFORMS.indexOf(key) > -1) {
          transformProps += `${key}(${value}) `
        }
        styles[this._transform] = transformProps;
      } else {
        styles[key] = value;
      }
    });

    return styles;
  }

  _childrenToRender = (currValues) => {
    return Object.keys(currValues).map(key => {
      const currValue = currValues[key];
      const { component, styles } = currValue;
      
      return(
        <Measure key={key}>
          {dimensions => {
            this._cachedDimensions[key] = dimensions;
            return cloneElement(component, {
              style: this._configToStyle(styles),
              dimensions
            })
          }}
        </Measure>
      );
    });
  }

  render() {
    const { component, onlyChild } = this.props;

    return(
      <TransitionSpring
        endValue={this._getEndValues}
        willEnter={this._willTransition}
        willLeave={this._willTransition}
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