// this may be of some help
// http://codepen.io/Tinricon/pen/ptAho

const TransformToMatrix = {
  perspective: (d) =>
    [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, -1 / d, 1]],

  translate: (x, y) =>
    [[1, 0, x], [0, 1, y]],

  translateX: (x) =>
    TransformToMatrix.translate(x, 0),

  translateY: (y) =>
    TransformToMatrix.translate(0, y),

  translateZ: (z) =>
    TransformToMatrix.translate3d(0, 0, z),

  translate3d: (x, y, z) =>
    [[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]],

  rotate: (a) =>
    TransformToMatrix.rotateZ(a),

  rotateX: (a) =>
    TransformToMatrix.rotate3d(1, 0, 0, a),

  rotateY: (a) =>
    TransformToMatrix.rotate3d(0, 1, 0, a),

  rotateZ: (a) => {
    const c = Math.cos(a);
    const n = Math.sin(a);
    return [[c, -n, 0], [n, c, 0]];
  },

  rotate3d: (x, y, z, a) => {
    
    const s = x * x + y * y + z * z;
    const c = Math.cos(a);
    const n = Math.sin(a);
    const i = 1 - c;
    const rs = Math.sqrt(s) * n;
    
    return [
      [(x * x + (y * y + z * z) * c) / s, (x * y * i - z * rs) / s, (x * z * i + y * rs) / s, 0],
      [(x * y * i + z * rs) / s, (y * y + (x * x + z * z) * c) / s, (y * z * i - x * rs) / s, 0],
      [(x * z * i - y * rs) / s, (y * z * i + x * rs) / s, (z * z + (x * x + y * y) * c) / s, 0],
      [0, 0, 0, 1]
    ];
  },

  scale: (x, y) =>
    [[x, 0, 0], [0, y, 0]],

  scaleX: (x) =>
    TransformToMatrix.scale(x, 1),

  scaleY: (y) =>
    TransformToMatrix.scale(1, y),

  scaleZ: (z) =>
    TransformToMatrix.scale3d(1, 1, z),

  scale3d: (x, y, z) =>
    [[x, 0, 0, 0], [0, y, 0, 0], [0, 0, z, 0], [0, 0, 0, 1]],

  skew: (x, y) =>
    [[1, Math.tan(x), 0], [Math.tan(y), 1, 0]],

  skewX: (x) =>
    [[1, Math.tan(x), 0], [0, 1, 0]],

  skewY: (y) =>
    [[1, 0, 0], [Math.tan(y), 1, 0]],

  toCSS: (matrix) =>
    'matrix3d(' +
      matrix.reduce((flat, row) => {
        flat.push.apply(flat, row)
        return flat;
      }, [])
    + ')'
};

export default TransformToMatrix;