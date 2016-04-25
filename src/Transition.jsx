import React, { Component, PropTypes, Children, createElement } from 'react'
import { TransitionMotion } from 'react-motion'
import isElement from './is-element'
import cloneStyles from './clone-styles'
import fromRMStyles from './from-RM-styles'
import toRMStyles from './to-RM-styles'
import configToStyle from './config-to-style'
import TransitionChild from './TransitionChild'

class Transition extends Component {
  static propTypes = {
    component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      isElement
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

  _dimensions = {}
  _instant = {}

  componentWillMount() {
    const { runOnMount, onEnter, children } = this.props

    if (runOnMount) {
      onEnter(this._onMountStyles())
    }

    Children.forEach(children, child => {
      if (!child) return
      this._instant[child.key] = !runOnMount
    })
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
    const { children, enter } = this.props

    return Children.map(children, child => {
      if (!child) return

      const { key } = child
      const childDimensions = this._dimensions[key]

      // convert to React Motion friendly structure
      const childStyles = toRMStyles(enter)

      if (enter.width &&
          (enter.width === 'auto' || enter.width.val === 'auto')) {
        const width = childDimensions ? childDimensions.width : 0

        // if instant, apply the height directly rather than through RM
        if (this._instant[key]) {
          childStyles.width = width
        } else {
          childStyles.width.val = width
        }
      }

      if (enter.height &&
          (enter.height === 'auto' || enter.height.val === 'auto')) {
        const height = childDimensions ? childDimensions.height : 0

        // if instant, apply the height directly rather than through RM
        if (this._instant[key]) {
          childStyles.height = height
        } else {
          childStyles.height.val = height
        }
      }

      if (!key) {
        console.error('You must provide a key for every child of Transition.')
      } else {
        return {
          key,
          data: child,
          style: {
            ...childStyles
          }
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

  _storeDimensions(key, childDimensions, mutations) {
    // if any mutations, set child to be instant
    // this keeps height from animating again if it changes
    if (mutations) {
      this._instant[key] = true
    }

    // store child dimensions
    this._dimensions[key] = childDimensions

    // rerender component
    this.forceUpdate()
  }

  _childrenToRender(currValues) {
    return currValues.map(({ key, data, style }) => {
      const child = data
      const childStyle = child.props.style
      const dimensions = this._dimensions[key]

      // convert styles to a friendly structure
      style = configToStyle(style)

      const currHeight = style.height

      // if height is being animated we'll want to
      // ditch it after it's reached its destination
      if (dimensions && currHeight) {
        const destHeight = parseFloat(dimensions.height).toFixed(4)

        style = {
          ...style,
          height: (destHeight > 0 && destHeight !== currHeight) ? currHeight : ''
        }
      }

      // merge in any styles set by the user
      // Transition styles will take precedence
      if (childStyle) {
        style = { ...childStyle, ...style }
      }

      return createElement(TransitionChild, {
        key,
        child,
        style,
        dimensions,
        onMeasure: this._storeDimensions.bind(this, key)
      })
    })
  }

  render() {
    const { component, ...props } = this.props

    return !props.children ? null : (
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
