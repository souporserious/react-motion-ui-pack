import React, { Component, PropTypes, Children, cloneElement } from 'react';
import { TransitionSpring, utils } from 'react-motion';
import { getVendorPrefix } from './utils';

const CSS = {
  transforms: ['translateX', 'translateY', 'scale', 'scaleX', 'scaleY', 'skewX', 'skewY', 'rotate', 'rotateX', 'rotateY'],
  transforms3D: ['transformPerspective', 'translateZ', 'scaleZ', 'rotateZ']
};

// could check for < IE10 support and only include non 3d transforms
const TRANSFORMS = CSS.transforms.concat(CSS.transforms3D);

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

  transform = getVendorPrefix('transform')
  heights = {}

  _storeChildHeights() {
    
    const childNodes = React.findDOMNode(this).children;

    Children.forEach(this.props.children, (child, i) => {
      
      if(!child) return;
      
      let childNode = childNodes[i];
      
      // set height since it is probably 0 from react-motion
      childNode.style.height = 'auto';

      // grab height and style from node
      let height = childNode.offsetHeight;
      let style = getComputedStyle(childNode);

      // subtract padding if box-sizing is set to anything other than border-box
      if(style.boxSizing !== 'border-box') {
        height -= parseInt(style.paddingTop) + parseInt(style.paddingBottom);
      }
      
      // store node height to access later
      this.heights[child.key] = height;
    });
  }

  componentDidMount() {
    if(this.props.enter.height && this.props.enter.height.val === 'auto') {
      this._storeChildHeights();
    }
  }

  componentDidUpdate() {

    if(this.props.enter.height && this.props.enter.height.val === 'auto') {
      // need setTimeout because node isn't available for some reason
      // need to look into why
      setTimeout(() => {
        this._storeChildHeights();
      });
    }
  }
  
  getEndValues(currValues) {

    const { children, appear, enter, leave } = this.props;
    const configs = {};
    const dest = (appear && !currValues) ? leave : enter;

    Children.forEach(children, component => {

      if(!component) return;

      // clone dest object
      let currDest = JSON.parse(JSON.stringify(dest));

      // allow 'auto' value to be passed for height
      if(dest.height && dest.height.val === 'auto') {

        let height = !currValues ? 0 : this.heights[component.key];

        currDest.height = {
          val: height
        };
      }

      configs[component.key] = {
        component: component,
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

  _mapTransforms(config) {
    
    let style = '';
    
    for(let prop in config) {
      
      if(!config.hasOwnProperty(prop)) return;
      
      for(let i = TRANSFORMS.length; i--;) {
        
        let transform = TRANSFORMS[i];
        
        if(prop === transform) {

          let value = config[prop].val;
          let unit = '';

          if(prop.indexOf('translate') > -1) {
            unit = 'px';
          }
          else if(prop.indexOf('rotate') > -1 ||
            prop.indexOf('skew') > -1) {
            unit = 'deg';
          }

          style += `${prop}(${value}${unit}) `;
        }
      }
    }

    return style;
  }

  _configToStyle(config) {

    let styles = {};

    Object.keys(config).map(key => {

      let transformIndex = TRANSFORMS.indexOf(key);

      if(transformIndex > -1) {
        styles[this.transform] = this._mapTransforms(config);
      } else {
        styles[key] = config[key].val;
      }
    });

    return styles;
  }

  render() {

    const childrenToRender = (currValues) => Object.keys(currValues).map(key => {
      
      const currValue = currValues[key];

      return cloneElement(currValue.component, {
        style: this._configToStyle(currValue.dest)
      })
    });

    return(
      <TransitionSpring
        endValue={::this.getEndValues}
        willEnter={::this.willTransition}
        willLeave={::this.willTransition}
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