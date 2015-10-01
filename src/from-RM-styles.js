export default function fromRMStyles(config) {
  let values = {}

  if(typeof config !== 'object') return null

  Object.keys(config).forEach(key => {
    const value = config[key].val

    if(!isNaN(value)) {
      values[key] = value
    }
  })

  return values
}
