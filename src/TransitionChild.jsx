import React, { Component, createElement, cloneElement } from 'react'
import Measure from 'react-measure'

class TransitionChild extends Component {
  render() {
    const { accurate, onMeasure, child, style, dimensions } = this.props
    const childProps = { style }

    if (typeof child.type === 'function') {
      childProps.dimensions = dimensions
    }

    return createElement(
      Measure,
      {
        accurate,
        whitelist: ['width', 'height'],
        onMeasure
      },
      cloneElement(child, childProps)
    )
  }
}

export default TransitionChild
