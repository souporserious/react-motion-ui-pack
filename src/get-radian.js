// convert strings like "55deg" or ".75rad" to floats (in radians)
export default function getRadian(str) {
  if (typeof str === 'string') {
		let angle = parseFloat(str, 10)

		// convert deg -> rad?
		if (str.indexOf('deg') > -1) {
			angle *= Math.PI / 180
		}
		return angle
	}
	return str
}
