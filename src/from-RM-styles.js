export default function fromRMStyles(config) {
  const values = {}

  Object.keys(config).forEach(key => {
    const value = config[key]
    values[key] = !isNaN(value) ? value : value.val
  })

  return values
}
