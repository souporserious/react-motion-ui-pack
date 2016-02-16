const TRANSFORM = require('get-prefix')('transform')
const UNIT_TRANSFORMS = ['translateX', 'translateY', 'translateZ', 'transformPerspective']
const DEGREE_TRANFORMS = ['rotate', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'scaleZ']
const UNITLESS_TRANSFORMS = ['scale', 'scaleX', 'scaleY']
const TRANSFORMS = UNIT_TRANSFORMS.concat(DEGREE_TRANFORMS, UNITLESS_TRANSFORMS)

export default function (configs) {
  let styles = {}
  
  Object.keys(configs).map(key => {
    const isTransform = (TRANSFORMS.indexOf(key) > -1)
    const value = configs[key].toFixed ? configs[key].toFixed(4) : configs[key]

    if (isTransform) {
      let transformProps = styles[TRANSFORM] || ''

      if (UNIT_TRANSFORMS.indexOf(key) > -1) {
        transformProps += `${key}(${value}px) `
      }
      else if (DEGREE_TRANFORMS.indexOf(key) > -1) {
        transformProps += `${key}(${value}deg) `
      }
      else if (UNITLESS_TRANSFORMS.indexOf(key) > -1) {
        transformProps += `${key}(${value}) `
      }
      styles[TRANSFORM] = transformProps
    } else {
      styles[key] = value
    }
  })

  return styles
}