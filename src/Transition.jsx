import React, { Component, PropTypes, Children, createElement, cloneElement } from 'react'
import { TransitionMotion } from 'react-motion'
import isElement from './is-element'
import cloneStyles from './clone-styles'
import fromRMStyles from './from-RM-styles'
import toRMStyles from './to-RM-styles'
import configToStyle from './config-to-style'
import specialAssign from './special-assign'
import TransitionChild from './TransitionChild'

const checkedProps = {
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    isElement
  ]),
  measure: PropTypes.bool,
  runOnMount: PropTypes.bool,
  appear: PropTypes.object,
  enter: PropTypes.object,
  leave: PropTypes.object,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func
}

class Transition extends Component {
  static propTypes = checkedProps

  static defaultProps = {
    component: 'div',
    measure: true,
    runOnMount: true,
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    onEnter: () => null,
    onLeave: () => null
  }

  _dimensions = {}
  _instant = {}

  componentWillMount() {
    const { component, runOnMount, onEnter, children } = this.props

    if (runOnMount) {
      onEnter(this._onMountStyles())
    }

    Children.forEach(children, child => {
      if (!child) return
      this._instant[child.key] = !runOnMount
    })
  }

  _isAuto(dimension) {
    const { enter } = this.props
    if (enter[dimension] &&
        (enter[dimension] === 'auto' || enter[dimension].val === 'auto')) {
      return true
    }
    return false
  }

  _onMountStyles() {
    const { runOnMount, appear, enter, leave, children } = this.props
    let childStyles = runOnMount ? (appear || leave) : enter

    // convert auto values and map to new object to avoid mutation
    return fromRMStyles(cloneStyles(childStyles))
  }

  _getDefaultStyles = () => {
    return Children.map(this.props.children, child => child && ({
      key: child.key,
      data: child,
      style: {
        ...this._onMountStyles()
      }
    }))
  }

  _getStyles = () => {
    const { component, children, enter } = this.props

    return Children.map(children, child => {
      if (!child) return

      let { key } = child
      const childDimensions = this._dimensions[key]

      // convert to React Motion friendly structure
      const childStyles = toRMStyles(enter)

      if (!key) {
        console.error('You must provide a key for every child of Transition.')
      }

      if (this._isAuto('width')) {
        const width = childDimensions ? childDimensions.width : 0

        // if instant, apply the height directly rather than through RM
        if (this._instant[key]) {
          childStyles.width = width
        } else {
          childStyles.width.val = width
        }
      }

      if (this._isAuto('height')) {
        const height = childDimensions ? childDimensions.height : 0

        // if instant, apply the height directly rather than through RM
        if (this._instant[key]) {
          childStyles.height = height
        } else {
          childStyles.height.val = height
        }
      }

      return {
        key,
        data: child,
        style: {
          ...childStyles
        }
      }
    })
  }

  _willEnter = ({ key, style }) => {
    const { appear, leave, onEnter } = this.props
    const childStyles = cloneStyles(
      (typeof appear === 'object') ? appear : leave
    )

    // fire enter callback
    onEnter(childStyles)

    return childStyles
  }

  _willLeave = ({ key, style }) => {
    const { leave, onLeave } = this.props

    // clean up
    if (this._dimensions[key]) {
      delete this._dimensions[key]
    }

    // fire leaving callback
    onLeave(style)

    return toRMStyles(leave)
  }

  _storeDimensions(key, childDimensions) {
    if (this._dimensions[key]) {
      this._instant[key] = true
    }

    // store child dimensions
    this._dimensions[key] = childDimensions

    // rerender component
    this.forceUpdate()
  }

  _childrenToRender(currValues) {
    const { measure } = this.props

    return currValues.map(({ key, data, style }) => {
      const child = data
      const childStyle = child.props.style
      const dimensions = this._dimensions[key]

      // convert styles to a friendly structure
      style = configToStyle(style)

      // handle auto properties respectively
      if (dimensions) {
        if (this._isAuto('height')) {
          const currHeight = style.height
          const destHeight = dimensions.height
          style = {
            ...style,
            height: (destHeight > 0 && destHeight !== currHeight) ? currHeight : ''
          }
        }
        if (this._isAuto('width')) {
          const currWidth = style.width
          const destWidth = dimensions.width
          style = {
            ...style,
            height: (destWidth > 0 && destWidth !== currWidth) ? currWidth : ''
          }
        }
      }

      // merge in any styles set by the user
      // Transition styles will take precedence
      if (childStyle) {
        style = { ...childStyle, ...style }
      }

      // just return the child with the new styles if we don't need to measure
      if (!measure) {
        return cloneElement(child, { style })
      }

      return createElement(TransitionChild, {
        key,
        child,
        style,
        dimensions,
        accurate: !this._instant[key],
        onMeasure: this._storeDimensions.bind(this, key)
      })
    })
  }

  render() {
    const { component } = this.props
    const props = specialAssign({}, this.props, checkedProps)

    return (
      <TransitionMotion
        defaultStyles={this._getDefaultStyles()}
        styles={this._getStyles()}
        willEnter={this._willEnter}
        willLeave={this._willLeave}
      >
        {currValues => {
          const children = this._childrenToRender(currValues)
          let child = null

          if (!component || component === 'false') {
            if (Children.count(children) === 1) {
              child = Children.only(children[0])
            } else {
              child = createElement('span', { style: { display: 'none' } })
            }
          } else {
            child = createElement(component, props, children)
          }

          return child
        }}
      </TransitionMotion>
    )
  }
}

export default Transition
