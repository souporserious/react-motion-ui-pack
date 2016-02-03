import React, { Component, PropTypes, Children, createElement } from 'react'
import { TransitionMotion, spring } from 'react-motion'
import cloneStyles from './clone-styles'
import toRMStyles from './to-RM-styles'
import fromRMStyles from './from-RM-styles'
import configToStyle from './config-to-style'
import TransitionChild from './TransitionChild'

function getChildFromKey(children, key) {
  let child = null

  Children.forEach(children, _child => {
    if (_child.key === key) {
      child = _child
      return
    }
  })

  return child
}

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
  _onlyKey = Date.now()
  _instant = {}

  _getDefaultStyles = () => {
    const { children, runOnMount, appear, enter, leave } = this.props
    let childStyles = enter

    if (runOnMount) {
      childStyles = appear || leave
    }

    // convert auto values and map to new object to avoid mutation
    childStyles = cloneStyles(childStyles)

    const cool = Children.map(children, child => child && ({
      key: child.key,
      style: {
        ...childStyles
      }
    }))

    return cool
  }
  
  _getStyles = () => {
    const { dimensions } = this.state
    const { children, enter } = this.props

    const cool = Children.map(children, child => {
      // if null is being passed, bail out
      if (!child) return;

      const { key } = child
      // const childDimensions = dimensions && dimensions[key]

      // convert to React Motion friendly structure
      let childStyles = toRMStyles(enter)

      // if (enter.width &&
      //     (enter.width === 'auto' || enter.width.val === 'auto')) {
      //   childStyles.width.val = childDimensions ? childDimensions.width : 0
      // }

      // if (enter.height &&
      //     (enter.height === 'auto' || enter.height.val === 'auto')) {
      //   let height = childDimensions ? childDimensions.height : 0

      //   // if instant, apply the height directly rather than through RM
      //   if (this._instant[key]) {
      //     childStyles.height = height

      //     // it only needs to be instant for one render
      //     // to prime RM for the next height transition
      //     // so we set it back to false
      //     this._instant[key] = false
      //   } else {
      //     childStyles.height.val = height
      //   }
      // }
      
      if (!key) {
        throw new Error('You must provide a key for every child of Transition.')
      } else {
        return {
          key,
          style: {
            ...childStyles
          }
        }
      }
    })

    return cool
  }

  _willEnter = ({ key, style }) => {
    const { appear, leave, onEnter } = this.props
    //const flatValues = fromRMStyles(endStyles[key])
    let childStyles = (typeof appear === 'object') ? appear : leave

    // convert auto values and map to new object to avoid mutation
    childStyles = cloneStyles(childStyles)

    // fire entering callback
    //onEnter(flatValues)

    return {
      ...style,
      ...toRMStyles(childStyles)
    }
  }

  _willLeave = ({ key, style }) => {
    const { leave, onLeave } = this.props
    //const flatValues = fromRMStyles(currentStyles[key])

    // TODO: when RM implements onEnd callback do cleanup
    // clean up dimensions when item leaves
    // if (this.state.dimensions[key]) {
    //   delete this.state.dimensions[key]
    // }
    
    // fire leaving callback
    //onLeave({ key, style })

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
    const { children } = this.props

    return currValues.map(({ key, style }) => {
      const child = getChildFromKey(children, key)
      const childStyle = child.props.style
      const dimensions = this.state.dimensions[key]

      // convert styles to a friendly structure
      style = configToStyle(style)
      
      // let currHeight = style.height
      
      // // if height is being animated we'll want to ditch it
      // // after it's reached its destination
      // if (dimensions && currHeight) {
      //   let destHeight = parseFloat(dimensions.height).toFixed(4)

      //   if (destHeight > 0 && destHeight !== currHeight) {
      //     style = {
      //       ...style,
      //       height: currHeight
      //     }
      //   } else {
      //     style = {
      //       ...style,
      //       height: ''
      //     }
      //   }
      // }

      // merge in any styles set by the user
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
        styles={this._getStyles()}
        willEnter={this._willEnter}
        willLeave={this._willLeave}
      >
        {currValues => {
          const children = this._childrenToRender(currValues)
          let wrapper = null

          if (!component || component === 'false') {
            if (Children.count(children) === 1) {
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