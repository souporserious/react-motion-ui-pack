// spread values to avoid mutation
// convert any auto values to a start of 0
export default function cloneStyles(style) {
  let newStyle = {...style}

  if (style.width === 'auto') {
    newStyle.width = 0
  }
  
  if (style.height === 'auto') {
    newStyle.height = 0
  }

  return newStyle
}