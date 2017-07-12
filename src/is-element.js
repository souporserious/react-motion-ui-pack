import { isValidElement } from 'react'

export default function isElement(props, propName, componentName) {
  if (typeof props[propName] !== 'function') {
    if (isValidElement(props[propName])) {
      return new Error(`${componentName} is not an actual Element`)
    }
  }
}
