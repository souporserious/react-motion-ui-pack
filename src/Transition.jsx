import React, { Component, PropTypes, Children, cloneElement } from 'react';
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
    appear: PropTypes.bool,
    //appear: PropTypes.object, // todo
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

  _transform = getVendorPrefix('transform')
  _cachedDimensions = {};
  
  componentDidMount() {
    // store registered components
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
  
  _getEndValues = (currValues) => {
    const { children, appear, enter, leave } = this.props;
    const configs = {};
    const dest = (appear && !currValues) ? leave : enter;

    Children.forEach(children, child => {
      if(!child) return;
      const dimensions = this._cachedDimensions[child.key];
      let currDest = {...dest};

      if(dimensions) {
        if(currDest.height && dest.height.val === 'auto') {
          currDest.height = {val: dimensions.height || 0};
        }
        if(currDest.width && dest.width.val === 'auto') {
          currDest.width = {val: dimensions.width || 0};
        }
      }
      
      configs[child.key] = {
        component: child,
        dest: currDest
      }
    });
    return configs;
  }

  _willTransition = (key, value, endValue, currentValue, currentSpeed) => {
    const { leave } = this.props;
    return {
      ...value,
      dest: leave
    };
  }

  _configToStyle(config) {
    let styles = {};

    Object.keys(config).map(key => {
      const isTransform = (TRANSFORMS.indexOf(key) > -1);
      const value = config[key].val;

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
  }

  render() {
    return(
      <TransitionSpring
        endValue={this._getEndValues}
        willEnter={this._willTransition}
        willLeave={this._willTransition}
      >
        {currValues => {
          const children = this._childrenToRender(currValues);
          const childCount = children.length;
          let component = <span style={{display: 'none'}} />;

          if(childCount > 0) {
            if(childCount === 1) {
              component = Children.only(children[0])
            } else {
              component = React.createElement(this.props.component, this.props, children);
            }
          }

          return React.createElement(this.props.component, this.props, children);
        }}
      </TransitionSpring>
    );
  }
}

export default Transition;