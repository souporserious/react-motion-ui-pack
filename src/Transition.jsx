import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import shallowCompare from 'react/lib/shallowCompare'
import { TransitionMotion, spring, utils } from 'react-motion'
import Measure from 'react-measure'
import toRMStyles from './to-RM-styles'
import fromRMStyles from './from-RM-styles'
import configToStyle from './config-to-style'

// TODOS:
// - add prop for default styles
// - make prop appear true/false to show animation on mount
//   would pass an empty config to tell RM not to drill into it

class Transition extends Component {
  static propTypes = {
    component: PropTypes.string,
    onlyChild: PropTypes.bool,
    measure: PropTypes.bool,
    appear: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ]),
    enter: PropTypes.object,
    leave: PropTypes.object,
    onEnter: PropTypes.func,
    onLeave: PropTypes.func
  }

  static defaultProps = {
    component: 'div', // define the wrapping tag around the elements you want to transition in/out
    measure: false, // pass true to use measure and get child dimensions to use with your animations
    runOnMount: true,
    enter: {
      opacity: 1
    },
    leave: {
      opacity: 0
    },
    onEnter: () => null,
    onLeave: () => null
  }

  _measureWarning = true
  state = {
    dimensions: {}
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return shallowCompare(this, nextProps, nextState)
  // }

  // convert auto values to a start of 0
  _convertAutoValues(style) {
    let newStyles = {...style}

    if(style.height === 'auto') {
      newStyles.height = 0
    }
    if(style.width === 'auto') {
      newStyles.width = 0
    }

    return newStyles
  }

  _getDefaultStyles = () => {
    const { children, runOnMount, appear, enter, leave } = this.props
    let childStyles = enter
    let configs = {}

    if(runOnMount) {
      childStyles = appear || leave
    }

    // convert auto values and map to new object to avoid mutation
    childStyles = this._convertAutoValues(childStyles)

    Children.forEach(children, child => {
      if(!child) return
      configs[child.key] = {
        child,
        ...childStyles
      }
    })

    return configs
  }
  
  _getEndStyles = () => {
    const { dimensions } = this.state
    const { children, enter } = this.props
    const configs = {}

    // convert to React Motion friendly structure
    let childStyles = toRMStyles(enter)

    Children.forEach(children, child => {
      if(!child) return

      const childDimensions = dimensions && dimensions[child.key]

      if(childStyles.height && childStyles.height.val === 'auto') {
        childStyles.height.val = childDimensions && childDimensions.height || 0
      }
      if(childStyles.width && childStyles.width.val === 'auto') {
        childStyles.width.val = childDimensions && childDimensions.width || 0
      }

      configs[child.key] = {
        child,
        ...childStyles
      }
    })

    return configs
  }

  _willEnter = (key, style, endStyles, currentStyles, currentSpeed) => {
    const { appear, leave, onEnter } = this.props
    const flatValues = fromRMStyles(endStyles[key])
    let childStyles = (typeof appear === 'object') ? appear : leave

    // convert auto values and map to new object to avoid mutation
    childStyles = this._convertAutoValues(childStyles)

    // fire entering callback
    onEnter(flatValues)

    return {
      ...style,
      ...toRMStyles(childStyles)
    }
  }

  _willLeave = (key, style, endStyles, currentStyles, currentSpeed) => {
    const { leave, onLeave } = this.props
    const flatValues = fromRMStyles(currentStyles[key])

    // clean up dimensions when item leaves
    delete this.state.dimensions[key]

    // fire leaving callback
    onLeave(flatValues)

    return {
      ...style,
      ...toRMStyles(leave)
    }
  }

  _storeDimensions = (key, childDimensions) => {
    const { dimensions } = this.state
    dimensions[key] = childDimensions
    this.setState({dimensions})
  }

  _shouldMeasure() {
    const { measure, enter } = this.props

    // warn against trying to use auto props without measure enabled
    if(!measure && this._measureWarning) {
      if(enter.width === 'auto' || enter.height === 'auto') {
        console.warn('Warning: "measure" prop needs to be enabled when using auto values https://github.com/souporserious/react-motion-ui-pack#props')
        this._measureWarning = false
      }
    }

    return measure
  }

  _childrenToRender = (currValues) => {
    return Object.keys(currValues).map(key => {
      const currValue = currValues[key]
      const { child, ...configs } = currValue
      const childStyles = child.props.style
      let style = configToStyle(configs)
      let component = null

      // merge in styles if they we're set by the user
      // Transition styles will take precedence
      if(childStyles) {
        style = {...childStyles, ...style}
      }

      // determine whether we need to measure the child or not
      if(this._shouldMeasure()) {
        const onChange = this._storeDimensions.bind(null, key)

        component = React.createElement(
          Measure,
          {key, clone: true, whitelist: ['width', 'height'], onChange},
          cloneElement(child, {style, dimensions: this.state.dimensions[key]})
        )
      } else {
        component = cloneElement(child, {key, style})
      }

      return component
    });
  }

  render() {
    const { component, onlyChild, appear } = this.props

    return(
      <TransitionMotion
        defaultStyles={this._getDefaultStyles()}
        styles={this._getEndStyles()}
        willEnter={this._willEnter}
        willLeave={this._willLeave}
      >
        {currValues => {
          const children = this._childrenToRender(currValues)
          let wrapper = null

          if(onlyChild) {
            if(children.length === 1) {
              wrapper = Children.only(children[0])
            } else {
              wrapper = createElement(component, {style: {display: 'none'}})
            }
          } else {
            wrapper = createElement(component, this.props, children)
          }

          return wrapper
        }}
      </TransitionMotion>
    );
  }
}

export default Transition