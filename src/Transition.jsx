import React, { Component, PropTypes, Children, createElement } from 'react'
import { TransitionMotion, spring } from 'react-motion'
import toRMStyles from './to-RM-styles'
import fromRMStyles from './from-RM-styles'
import configToStyle from './config-to-style'
import TransitionChild from './TransitionChild'

class Transition extends Component {
  static propTypes = {
    component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
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
  _instant = {}

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

    Children.forEach(children, child => {
      if (!child) return

      const { key } = child
      const childDimensions = dimensions && dimensions[key]

      // convert to React Motion friendly structure
      let childStyles = toRMStyles(enter)

      if (enter.height && enter.height.val === 'auto') {
        let height = childDimensions && childDimensions.height || 0

        // if instant, apply the height directly rather than through RM
        if (this._instant[key]) {
          childStyles.height = height
        } else {
          childStyles.height.val = height
        }
      }

      if (enter.width && enter.width.val === 'auto') {
        childStyles.width.val = childDimensions && childDimensions.width || 0
      }

      configs[key] = {
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
    // if (this.state.dimensions[key]) {
    //   delete this.state.dimensions[key]
    // }
    
    // fire leaving callback
    onLeave(flatValues)

    return {
      ...style,
      ...toRMStyles(leave)
    }
  }

  _storeDimensions = (key, childDimensions, mutations) => {
    const { dimensions } = this.state

    // if any mutations, set instantly
    if (mutations) {
      this._instant[key] = true
    }
    
    // store child dimensions
    dimensions[key] = childDimensions
    
    // update state with new dimensions
    this.setState({dimensions})
  }

  _childrenToRender = (currValues) => {
    return Object.keys(currValues).map(key => {
      const {child, ...configs} = currValues[key] 
      const dimensions = this.state.dimensions[key]
      const childStyle = child.props.style
      let style = configToStyle(configs)
      let currHeight = style.height
      
      // if height is being animated we'll want to ditch it
      // after it's reached its destination
      if (dimensions && currHeight) {
        let destHeight = parseFloat(dimensions.height).toFixed(4)

        if (destHeight > 0 && destHeight !== currHeight) {
          style = {
            ...style,
            height: currHeight,
            overflow: 'hidden'
          }
        } else {
          style = {
            ...style,
            height: ''
          }
        }
      }

      // merge in styles if they we're set by the user
      // Transition styles will take precedence
      if (childStyle) {
        style = {...childStyle, ...style}
      }

      return React.createElement(TransitionChild, {
        key,
        child,
        style,
        dimensions,
        onMeasure: this._storeDimensions.bind(null, key)
      })
    })
  }

  render() {
    const { component, appear } = this.props

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

          if (!component || component === 'false') {
            if (children.length === 1) {
              wrapper = Children.only(children[0])
            } else {
              wrapper = createElement('span', {style: {display: 'none'}})
            }
          } else {
            wrapper = createElement(component, this.props, children)
          }

          return wrapper
        }}
      </TransitionMotion>
    )
  }
}

export default Transition