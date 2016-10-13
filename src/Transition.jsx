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

const AUTO_PROPS = ['width', 'height']

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

  _childDimensions = {}
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

  _isAutoValue(prop) {
    const enterProp = this.props.enter[prop]
    return enterProp && (enterProp === 'auto' || enterProp.val === 'auto')
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
      const childDimensions = this._childDimensions[key]

      // convert to React Motion friendly structure
      const childStyles = toRMStyles(enter)
      const handleAutoValues = (prop) => {
        if (!this._isAutoValue(prop)) return;

        const value = childDimensions ? childDimensions.first[prop] : 0

        // if instant, apply the property directly rather than animating through RM
        if (this._instant[key]) {
          childStyles[prop] = value
        } else {
          childStyles[prop].val = value
        }
      }

      if (!key) {
        console.error('You must provide a key for every child of Transition.')
      }

      // handle auto values respectively
      AUTO_PROPS.forEach(prop => handleAutoValues(prop))

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
    if (this._childDimensions[key]) {
      delete this._childDimensions[key]
    }

    // fire leaving callback
    onLeave(style)

    return toRMStyles(leave)
  }

  _storeChildDimensions(key, childDimensions) {
    // store the first measurement so we can reference it later
    if (!this._childDimensions[key]) {
      this._childDimensions[key] = {
        first: childDimensions,
        current: childDimensions,
        instant: false
      }
    } else {
      this._childDimensions[key].current = childDimensions
    }

    // rerender component
    this.forceUpdate()
  }

  _childrenToRender(currValues) {
    const { measure } = this.props

    return currValues.map(({ key, data, style }) => {
      const child = data
      const childStyle = child.props.style
      const childDimensions = this._childDimensions[key]
      // const applyAutoValue = (prop) => {
      //   if (this._isAutoValue(prop)) {
      //     const currHeight = style[prop]
      //     const destHeight = dimensions[prop]
      //     style = {
      //       ...style,
      //       // height: (destHeight > 0 && destHeight !== currHeight) ? currHeight : ''
      //       height: currHeight
      //     }
      //   }
      // }

      // convert styles to a friendly structure
      style = configToStyle(style)

      // handle auto properties respectively
      if (childDimensions) {
        if (this._isAutoValue('height')) {
          const currHeight = style.height
          let destHeight

          // if we have reached our destination we need to start applying
          // the dimension instantly so it's "primed" for when we transition out
          if (currHeight === childDimensions.first.height) {
            childDimensions.instant = true
          }

          // if we are applying instantly we will use the current dimension so
          // it transitions out from the proper place
          if (childDimensions.instant) {
            destHeight = childDimensions.current.height
          } else {
            console.log('huh?')
            destHeight = childDimensions.first.height
          }

          style = {
            ...style,
            height: (destHeight > 0 && destHeight !== currHeight) ? currHeight : ''
          }
        }
        if (this._isAutoValue('width')) {
          const currWidth = style.width
          const destWidth = childDimensions.first.width
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
        dimensions: childDimensions,
        useClone: true,
        onMeasure: this._storeChildDimensions.bind(this, key)
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
