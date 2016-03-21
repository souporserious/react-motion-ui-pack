// spread values to avoid mutation
// convert any auto values to a start of 0
export default function cloneStyles(style) {
  const { width, height } = style
  const newStyle = { ...style }

  if (width) {
    if (width.val && width.val === 'auto') {
      newStyle.width = { ...newStyle.width, val: 0 }
    } else if (width === 'auto') {
      newStyle.width = 0
    }
  }

  if (height) {
    if (height.val && height.val === 'auto') {
      newStyle.height = { ...newStyle.height, val: 0 }
    } else if (height === 'auto') {
      newStyle.height = 0
    }
  }

  return newStyle
}
