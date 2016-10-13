import React, { Component, PropTypes, Children, createElement, cloneElement } from 'react'
import { TransitionMotion } from 'react-motion'
import isElement from './is-element'
import fromRMStyles from './from-RM-styles'
import toRMStyles from './to-RM-styles'
import configToStyle from './config-to-style'
import specialAssign from './special-assign'

const checkedProps = {
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

class Transition extends Component {
  static propTypes = checkedProps

  static defaultProps = {
    component: 'div',
    runOnMount: true,
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    onEnter: () => null,
    onLeave: () => null
  }

  componentWillMount() {
    const { component, runOnMount, onEnter, children } = this.props

    if (runOnMount) {
      onEnter(this._getMountStyles())
    }
  }

  _getMountStyles() {
    const { runOnMount, appear, enter, leave, children } = this.props
    return fromRMStyles(runOnMount ? (appear || leave) : enter)
  }

  _getDefaultStyles = () => {
    return Children.map(this.props.children, child => {
      if (child) {
        return ({
          key: child.key,
          data: child,
          style: {
            ...this._getMountStyles()
          }
        })
      }
    })
  }

  _getStyles = () => {
    const { component, children, enter } = this.props

    return Children.map(children, child => {
      if (!child) return

      const { key } = child

      if (!key) {
        console.error('You must provide a key for every child of Transition.')
      }

      return {
        key,
        data: child,
        style: {
          ...toRMStyles(enter)
        }
      }
    })
  }

  _willEnter = ({ key, style }) => {
    const { appear, leave, onEnter } = this.props
    const childStyles = (typeof appear === 'object') ? appear : leave

    // fire enter callback
    onEnter(childStyles)

    return childStyles
  }

  _willLeave = ({ key, style }) => {
    const { leave, onLeave } = this.props

    // fire leaving callback
    onLeave(style)

    return toRMStyles(leave)
  }

  _childrenToRender(currValues) {
    return currValues.map(({ key, data, style }) => {
      const child = data
      const childStyle = child.props.style

      // convert styles to a friendly structure
      style = configToStyle(style)

      // merge in any styles set by the user
      // Transition styles will take precedence
      if (childStyle) {
        style = { ...childStyle, ...style }
      }

      return cloneElement(child, { style })
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
        { currValues => {
          const children = this._childrenToRender(currValues)
          let child = null

          if (!component || component === 'false') {
            if (Children.count(children) === 1) {
              child = Children.only(children[0])
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
