import React, { Component, createElement, cloneElement } from 'react'
import Measure from 'react-measure'

class TransitionChild extends Component {
  render() {
    const { onMeasure, child, style, dimensions } = this.props

    return createElement(
      Measure,
      {
        config: {
          childList: true,
          subtree: true
        },
        accurate: true,
        whitelist: ['width', 'height'],
        onMeasure
      },
      cloneElement(child, { style, dimensions })
    )
  }
}

export default TransitionChild
