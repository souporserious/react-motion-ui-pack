'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = toRMStyles;

var _reactMotion = require('react-motion');

function toRMStyles(styles) {
  var rmStyles = {};

  Object.keys(styles).forEach(function (key) {
    var style = styles[key];
    var isObject = typeof style === 'object';

    // check if user passed their own config
    // if not default to regular spring
    rmStyles[key] = isObject ? style : (0, _reactMotion.spring)(style);
  });

  return rmStyles;
}

module.exports = exports['default'];