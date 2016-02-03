export default function fromRMStyles(config) {
  const values = {}

  Object.keys(config).forEach(key => {
    const value = config[key].val

    if (!isNaN(value)) {
      values[key] = value
    }
  })

  return values
}
