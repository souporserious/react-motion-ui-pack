import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import { TransitionMotion, spring, utils } from 'react-motion'
import Measure from 'react-measure'
import toRMStyles from './to-RM-styles'
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
    leave: PropTypes.object
  }

  static defaultProps = {
    component: 'div', // define the wrapping tag around the elements you want to transition in/out
    onlyChild: false, // useful if you only want to transition in/out 1 element rather than a list
    measure: false, // pass true to use measure and get child dimensions to use with your animations
    appear: true, // accepts an object or boolean, if boolean passed it will use "leave" as the origin point of the transition
    enter: {
      opacity: 1
    },
    leave: {
      opacity: 0
    }
  }

  state = {
    dimensions: {}
  }

  _getDefaultStyles = () => {
    const { children, appear, enter, leave } = this.props
    let childStyles = enter
    let configs = {}

    if(appear) {
      childStyles = (typeof appear === 'object') ? appear : leave
    }

    // copy styles so we don't mutate them
    childStyles = {...childStyles}

    Children.forEach(children, child => {
      if(!child) return

      if(childStyles.height === 'auto') {
        childStyles.height = 0
      }
      if(childStyles.width === 'auto') {
        childStyles.width = 0
      }

      configs[child.key] = {
        child,
        ...childStyles
      }
    })

    return configs
  }
  
  _getEndStyles = (s) => {
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

  _willEnter = (key, value, endValue, currentValue, currentSpeed) => {
    const { appear, leave } = this.props
    let childStyles = (typeof appear === 'object') ? appear : leave

    // copy styles so we don't mutate them
    // TODO: move into a function
    childStyles = {...childStyles}

    if(childStyles.height === 'auto') {
      childStyles.height = 0
    }
    if(childStyles.width === 'auto') {
      childStyles.width = 0
    }

    return {
      ...value,
      ...toRMStyles(childStyles)
    }
  }

  _willLeave = (key, value, endValue, currentValue, currentSpeed) => {
    // clean up dimensions when item leaves
    delete this.state.dimensions[key]

    return {
      ...value,
      ...toRMStyles(this.props.leave)
    }
  }

  _storeDimensions = (key, childDimensions) => {
    const { dimensions } = this.state
    dimensions[key] = childDimensions
    this.setState({dimensions})
  }

  _shouldMeasure() {
    const { measure, enter } = this.props

    return measure || 
           (enter.width === 'auto') ||
           (enter.height === 'auto')
  }

  _childrenToRender = (currValues) => {
    return Object.keys(currValues).map(key => {
      const currValue = currValues[key]
      const { child, ...configs } = currValue
      const style = configToStyle(configs)
      let component = null

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