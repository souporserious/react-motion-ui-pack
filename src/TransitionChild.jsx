import React, { Component, cloneElement, createElement } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import Measure from 'react-measure'

class TransitionChild extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  
  render() {
    const { key, onMeasure, child, style, dimensions } = this.props
    
    return React.createElement(
      Measure,
      {
        key,
        config: {
          childList: true,
          subtree: true
        },
        accurate: true,
        whitelist: ['width', 'height'],
        onMeasure
      },
      cloneElement(child, {style, dimensions})
    )
  }
}

export default TransitionChild