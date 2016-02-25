'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var TRANSFORM = require('get-prefix')('transform');
var UNIT_TRANSFORMS = ['translateX', 'translateY', 'translateZ', 'transformPerspective'];
var DEGREE_TRANFORMS = ['rotate', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'scaleZ'];
var UNITLESS_TRANSFORMS = ['scale', 'scaleX', 'scaleY'];
var TRANSFORMS = UNIT_TRANSFORMS.concat(DEGREE_TRANFORMS, UNITLESS_TRANSFORMS);

exports['default'] = function (configs) {
  var styles = {};

  Object.keys(configs).map(function (key) {
    var isTransform = TRANSFORMS.indexOf(key) > -1;
    var value = configs[key].toFixed ? configs[key].toFixed(4) : configs[key];

    if (isTransform) {
      var transformProps = styles[TRANSFORM] || '';

      if (UNIT_TRANSFORMS.indexOf(key) > -1) {
        transformProps += key + '(' + value + 'px) ';
      } else if (DEGREE_TRANFORMS.indexOf(key) > -1) {
        transformProps += key + '(' + value + 'deg) ';
      } else if (UNITLESS_TRANSFORMS.indexOf(key) > -1) {
        transformProps += key + '(' + value + ') ';
      }
      styles[TRANSFORM] = transformProps;
    } else {
      styles[key] = value;
    }
  });

  return styles;
};

module.exports = exports['default'];