import { spring } from 'react-motion'

export default function toRMStyles(styles) {
  let rmStyles = {}
  
  Object.keys(styles).forEach(key => {
    let style = styles[key]
    let isObject = (typeof style === 'object')

    // check if user passed their own config
    // if not default to regular spring
    rmStyles[key] = isObject ? {...style} : spring(style)
  })

  return rmStyles
}
