// ported from:
// https://github.com/bcherny/css-to-matrix
// https://github.com/amadeus/transformer

import getRadian from './get-radian'

var _toString = Object.prototype.toString;
var _matrixRegex = /(.*matrix[\w]*\(| |\).*)/g;

var CSSToMatrix = function CSSToMatrix(data) {
	this.matrix = CSSToMatrix.identity();

	// set data?
	if (data) {
		this.setMatrix(data);
	}
};

CSSToMatrix.prototype = {
	// set matrix in model
	setMatrix: function (data) {
		if (process.env.NODE_ENV == 'development') {
  		if (_toString.call(data) !== '[object Array]') {
  			throw new TypeError('expected parameter `data` to be an Array, but was given a ' + _toString.call(data));
  		}

  		if (_toString.call(data[0]) !== '[object Array]') {
  			throw new TypeError('nested array expected.');
  		}

  		if (data.length !== data[0].length) {
  			throw new Error('parent and child arrays must be the same length');
  		}

  		if (data.length > 4 || data.length < 3) {
  			throw new Error('must be a 3x3 or 4x4 matrix, was ' + data.length + 'x' + data[0].length);
  		}
    }

		if (data.length === 3) {
			CSSToMatrix.from3x3to4x4(data);
		}

		this.matrix = CSSToMatrix.merge(this.matrix, data);

		return this;
	},

	setMatrixFromCSS: function(str){
		var matrix = CSSToMatrix.getMatrixFromCSS(str);
		this.setMatrix(matrix);
		return this;
	},

	// apply transformations as defined in the model, and get back get calculated matrix
	getMatrixCopy: function() {
		return CSSToMatrix.clone(this.matrix);
	},

	// get matrix formatted as a string that can be plugged right into CSS's `transform` function
	getMatrixCSS: function() {
		return 'matrix3d(' +
			CSSToMatrix.flip(this.getMatrixCopy()).reduce(function (flat, row) {
				flat.push.apply(flat, row);
				return flat;
			}, []).join(',') + ')';
	},

	// transform functions
	// 1-to-1 with their CSS equivalents
	rotate     : function (a) {
		return this.rotateZ(a);
	},

	rotateX    : function (a) {
		return this.rotate3d(1, 0, 0, a);
	},

	rotateY    : function (a) {
		return this.rotate3d(0, 1, 0, a);
	},

	rotateZ    : function (a) {
		return this.rotate3d(0, 0, 1, a);
	},

	scale      : function (x, y = x) {
		return this.scale3d(x, y);
	},

	scaleX     : function (x) {
		return this.scale3d(x);
	},

	scaleY     : function (y) {
		return this.scale3d(null, y);
	},

	scaleZ     : function (z) {
		return this.scale3d(null, null, z);
	},

	skewX      : function (x) {
		return this.skew(x);
	},

	skewY      : function (y) {
		return this.skew(null, y);
	},

	translate  : function (x, y) {
		return this.translate3d(x, y);
	},

	translateX : function (x) {
		return this.translate3d(x);
	},

	translateY : function (y) {
		return this.translate3d(null, y);
	},

	translateZ : function (z) {
		return this.translate3d(null, null, z);
	},

	perspective: function (x) {
		if (!x) {
			x = 0;
		}

		////DEBUG-START
		if (typeof x !== 'number') {
			throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x);
		}
		////DEBUG-END

		CSSToMatrix.multiply(
			this.matrix,
			Compute.perspective(x)
		);

		return this;
	},

	rotate3d: function (x, y, z, a) {
		if (!x) {
			x = 0;
		}
		if (!y) {
			y = 0;
		}
		if (!z) {
			z = 0;
		}
		if (!a) {
			a = 0;
		}

		////DEBUG-START
		if (typeof x !== 'number') {
			throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x);
		}
		if (typeof y !== 'number') {
			throw new TypeError('expected parameter `y` to be a Number, but was given a ' + typeof y);
		}
		if (typeof z !== 'number') {
			throw new TypeError('expected parameter `z` to be a Number, but was given a ' + typeof z);
		}
		////DEBUG-END

		CSSToMatrix.multiply(
			this.matrix,
			Compute.rotate3d(
				x,
				y,
				z,
				getRadian(a)
			)
		);

		return this;
	},

	scale3d: function (x, y, z) {
		if (!x && x !== 0) {
			x = 1;
		}
		if (!y && y !== 0) {
			y = 1;
		}
		if (!z && z !== 0) {
			z = 1;
		}

		////DEBUG-START
		if (typeof x !== 'number') {
			throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x);
		}
		if (typeof y !== 'number') {
			throw new TypeError('expected parameter `y` to be a Number, but was given a ' + typeof y);
		}
		if (typeof z !== 'number') {
			throw new TypeError('expected parameter `z` to be a Number, but was given a ' + typeof z);
		}
		////DEBUG-END

		CSSToMatrix.multiply(
			this.matrix,
			Compute.scale3d(x, y, z)
		);

		return this;
	},

	skew: function (x, y) {
		if (!x) {
			x = 0;
		}
		if (!y) {
			y = 0;
		}

		CSSToMatrix.multiply(
			this.matrix,
			CSSToMatrix.to3d(
				Compute.skew(
					getRadian(x),
					getRadian(y)
				)
			)
		);

		return this;
	},

	translate3d: function(x, y, z) {
		if (!x) {
			x = 0;
		}
		if (!y) {
			y = 0;
		}
		if (!z) {
			z = 0;
		}

		if (process.env.NODE_ENV == 'development') {
  		if (typeof x !== 'number') {
  			throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x);
  		}
  		if (typeof y !== 'number') {
  			throw new TypeError('expected parameter `y` to be a Number, but was given a ' + typeof y);
  		}
  		if (typeof z !== 'number') {
  			throw new TypeError('expected parameter `z` to be a Number, but was given a ' + typeof z);
  		}
    }

		CSSToMatrix.multiply(
			this.matrix,
			Compute.translate3d(x, y, z)
		);

		return this;
	}

};

CSSToMatrix.clone = function(matrix){
	var newMatrix = [],
		r, c;

	for (r = 0; r < matrix.length; r++) {
		newMatrix[r] = [];
		for (c = 0; c < matrix[r].length; c++) {
			newMatrix[r][c] = matrix[r][c] || 0;
		}
	}

	return newMatrix;
};

CSSToMatrix.merge = function(base, toMerge){
	var r, c;

	for (r = 0; r < base.length; r++) {
		for (c = 0; c < base[r].length; c++) {
			base[r][c] = toMerge[r][c] || 0;
		}
	}

	return base;
};

CSSToMatrix.from3x3to4x4 = function(matrix){
	matrix[0].push(0);
	matrix[1].push(0);
	matrix[2].push(0);
	matrix[3] = [0, 0, 0, 1];
	return matrix;
};

CSSToMatrix.getMatrixFromCSS = function(str){
	var values, matrix, i, ii;

	if (str === 'none' || !str) {
		return CSSToMatrix.identity();
	}

	str = str.replace(_matrixRegex, '');
	values = str.split(',');

	if (process.env.NODE_ENV == 'development') {
  	if (values.length !== 6 && values.length !== 16) {
  		throw new TypeError('invalid array parsed from string: ' + str);
  	}
  }

	if (values.length === 6) {
		values.splice(2, 0, 0, 0);
		values.splice(6, 0, 0, 0);
		values.push(1, 0, 0, 0, 0, 1);
	}

	matrix = [];

	for (i = 0; i < values.length / 4; i++) {
		matrix[i] = [];
		for (ii = 0; ii < 4; ii++) {
			matrix[i][ii] = parseFloat(values[(i * 4) + ii]);
		}
	}

	matrix = CSSToMatrix.flip(matrix);

	return matrix;
};

// Ported from https://github.com/eighttrackmind/matrix-utilities
// Based on matrix-utilities library, simplified and
// ported to modify the original and create less garbage
CSSToMatrix.multiply = function(base, toMultiply) {
	var r, c, l, result, row, size, sum;

  if (process.env.NODE_ENV == 'development') {
  	if (base[0].length !== toMultiply.length) {
  		throw new Error('Matrix 1\'s row count should equal matrix 2\'s column count');
  	}
  }
	result = [];
	size = toMultiply.length;
	for (r = 0; r < size; r++) {
		row = toMultiply[r];
		for (c = 0; c < row.length; c++) {
			l = size;
			sum = 0;
			while (l--) {
				sum += base[r][l] * toMultiply[l][c];
			}
			result.push(sum);
		}
	}
	row = undefined;

	l = 0;
	for (r = 0; r < base.length; r++) {
		for (c = 0; c < base[r].length; c++) {
			base[r][c] = result[l];
			l++;
		}
	}
	result.length = 0;

	return base;
};

// Ported from https://github.com/eighttrackmind/matrix-utilities
CSSToMatrix.flip = function(matrix) {
	var r, c, result, row, value, len;
	result = [];
	len = matrix.length;

	for (r = 0; r < len; r++) {
		row = matrix[r];
		for (c = 0; c < len; c++) {
			value = row[c];
			(result[c] || (result[c] = []))[r] = value;
		}
	}

	return result;
};

// Ported from https://github.com/eighttrackmind/matrix-utilities
CSSToMatrix.to2d = function(matrix){
	return [
		[matrix[0][0] || 1, matrix[0][1] || 0, matrix[0][3] || 0],
		[matrix[1][0] || 0, matrix[1][1] || 1, matrix[1][3] || 0]
	];
};

// Ported from https://github.com/eighttrackmind/matrix-utilities
CSSToMatrix.to3d = function(matrix) {
	return [
		[matrix[0][0] || 1, matrix[0][1] || 0, 0, matrix[0][2] || 0],
		[matrix[1][0] || 0, matrix[1][1] || 1, 0, matrix[1][2] || 0],
		[0, 0, 1, 0],
		[0, 0, 0, 1]
	];
};

// Ported from https://github.com/eighttrackmind/matrix-utilities
// If a matrix is provided, reset all values to an identity matrix
// Otherise create a new one
CSSToMatrix.identity = function(matrix){
	var r, c;

	if (!matrix) {
		return [
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
		];
	}

	for (r = 0; r < matrix.length; r++) {
		for (c = 0; c < matrix[r].length; c++) {
			if (r === c) {
				matrix[r][c] = 1;
			} else {
				matrix[r][c] = 0;
			}
		}
	}

	return matrix;
};

// Ported from https://github.com/eighttrackmind/transform-to-matrix
var Compute = {
	perspective: function(d) {
		return [
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[0, 0, -1 / d, 1]
		];
	},

	rotate: function(a) {
		return Compute.rotateZ(a);
	},

	rotateX: function(a) {
		return Compute.rotate3d(1, 0, 0, a);
	},

	rotateY: function(a) {
		return Compute.rotate3d(0, 1, 0, a);
	},

	rotateZ: function(a) {
		var c, n;
		c = Math.cos(a);
		n = Math.sin(a);
		return [
			[c, -n, 0],
			[n, c, 0]
		];
	},

	rotate3d: function(x, y, z, a) {
		var c, i, n, rs, s;
		s = x * x + y * y + z * z;
		c = Math.cos(a);
		n = Math.sin(a);
		i = 1 - c;
		rs = Math.sqrt(s) * n;
		return [
			[(x * x + (y * y + z * z) * c) / s, (x * y * i - z * rs) / s, (x * z * i + y * rs) / s, 0],
			[(x * y * i + z * rs) / s, (y * y + (x * x + z * z) * c) / s, (y * z * i - x * rs) / s, 0],
			[(x * z * i - y * rs) / s, (y * z * i + x * rs) / s, (z * z + (x * x + y * y) * c) / s, 0],
			[0, 0, 0, 1]
		];
	},

	scale: function(x, y = x) {
		return [
			[x, 0, 0],
			[0, y, 0]
		];
	},

	scaleX: function(x) {
		return Compute.scale(x, 1);
	},

	scaleY: function(y) {
		return Compute.scale(1, y);
	},

	scaleZ: function(z) {
		return Compute.scale3d(1, 1, z);
	},

	scale3d: function(x, y, z) {
		return [
			[x, 0, 0, 0],
			[0, y, 0, 0],
			[0, 0, z, 0],
			[0, 0, 0, 1]
		];
	},

	skew: function(x, y) {
		return [
			[1, Math.tan(x), 0],
			[Math.tan(y), 1, 0]
		];
	},

	skewX: function(x) {
		return [
			[1, Math.tan(x), 0],
			[0, 1, 0]
		];
	},

	skewY: function(y) {
		return [
			[1, 0, 0],
			[Math.tan(y), 1, 0]
		];
	},

	translate: function(x, y) {
		return [
			[1, 0, x],
			[0, 1, y]
		];
	},

	translateX: function(x) {
		return Compute.translate(x, 0);
	},

	translateY: function(y) {
		return Compute.translate(0, y);
	},

	translateZ: function(z) {
		return Compute.translate3d(0, 0, z);
	},

	translate3d: function(x, y, z) {
		return [
			[1, 0, 0, x],
			[0, 1, 0, y],
			[0, 0, 1, z],
			[0, 0, 0, 1]
		];
	}
};

export default CSSToMatrix
