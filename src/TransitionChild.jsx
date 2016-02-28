import Measure from 'react-measure'
import React, {
  Component,
  cloneElement,
  PropTypes,
} from 'react'

class TransitionChild extends Component {
  static propTypes = {
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onMeasure: PropTypes.func,
    child: PropTypes.element,
    style: PropTypes.object,
    dimensions: PropTypes.object,
  }
  render() {
    const { key, onMeasure, child, style, dimensions } = this.props

    return React.createElement(
      Measure,
      {
        key,
        config: {
          childList: true,
          subtree: true,
        },
        accurate: true,
        whitelist: ['width', 'height'],
        onMeasure,
      },
      cloneElement(child, { style, dimensions })
    )
  }
}

export default TransitionChild
