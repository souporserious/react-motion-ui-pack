import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import shallowCompare from 'react/lib/shallowCompare'
import { TransitionMotion, spring, utils } from 'react-motion'
import Measure from 'react-measure'
import toRMStyles from './to-RM-styles'
import fromRMStyles from './from-RM-styles'
import configToStyle from './config-to-style'

// TODOS:
// - if using "auto" value make sure RM does not use the value after
//   it has transitioned in. It should only work on mount/unmount but
//   be able to know the new height it has gone to so on unmount the 
//   height transitions nicely

class Transition extends Component {
  static propTypes = {
    component: PropTypes.string,
    onlyChild: PropTypes.bool,
    runOnMount: PropTypes.bool,
    appear: PropTypes.object,
    enter: PropTypes.object,
    leave: PropTypes.object,
    onEnter: PropTypes.func,
    onLeave: PropTypes.func
  }

  static defaultProps = {
    component: 'div',
    runOnMount: true,
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    onEnter: () => null,
    onLeave: () => null
  }

  state = {
    dimensions: {}
  }
  _firstPass = {}

  // shouldComponentUpdate(nextProps, nextState) {
  //   return shallowCompare(this, nextProps, nextState)
  // }

  // convert auto values to a start of 0
  _convertAutoValues(style) {
    let newStyles = {...style}

    if (style.height === 'auto') {
      newStyles.height = 0
    }
    if (style.width === 'auto') {
      newStyles.width = 0
    }

    return newStyles
  }

  _getDefaultStyles = () => {
    const { children, runOnMount, appear, enter, leave } = this.props
    let childStyles = enter
    let configs = {}

    if (runOnMount) {
      childStyles = appear || leave
    }

    // convert auto values and map to new object to avoid mutation
    childStyles = this._convertAutoValues(childStyles)

    Children.forEach(children, child => {
      if (!child) return

      const { key } = child

      // this will be the first pass on the child
      this._firstPass[key] = true

      configs[key] = {
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
      if (!child) return

      const childDimensions = dimensions && dimensions[child.key]

      if (childStyles.height && childStyles.height.val === 'auto') {
        childStyles.height.val = childDimensions && childDimensions.height || 0
      }
      if (childStyles.width && childStyles.width.val === 'auto') {
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
    if (this.state.dimensions[key]) {
      delete this.state.dimensions[key]
    }

    // fire leaving callback
    onLeave(flatValues)

    return {
      ...style,
      ...toRMStyles(leave)
    }
  }

  _storeDimensions = (key, childDimensions) => {
    const { dimensions } = this.state

    // clean up first pass
    delete this._firstPass[key]
    
    // store child dimensions
    dimensions[key] = childDimensions
    
    // update state with new dimensions
    this.setState({dimensions})
  }

  _childrenToRender = (currValues) => {
    return Object.keys(currValues).map(key => {
      const {child, ...configs} = currValues[key]
      const childStyles = child.props.style
      const onMeasure = this._storeDimensions.bind(null, key)
      const dimensions = this.state.dimensions[key]
      let style = configToStyle(configs)

      // merge in styles if they we're set by the user
      // Transition styles will take precedence
      if (childStyles) {
        style = {...childStyles, ...style}
      }

      // if we have dimensions, we don't need to add height into the style anymore
      if (!this._firstPass[key]) {
        return cloneElement(child, {style, dimensions})
      } else {
        return React.createElement(
          Measure,
          { key, accurate: true, whitelist: ['width', 'height'], onMeasure },
          cloneElement(child, {style, dimensions})
        )
      }
    })
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

          if (onlyChild) {
            if (children.length === 1) {
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