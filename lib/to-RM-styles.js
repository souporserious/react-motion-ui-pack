'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = toRMStyles;

var _reactMotion = require('react-motion');

function toRMStyles(styles) {
  var rmStyles = {};

  Object.keys(styles).forEach(function (key) {
    var style = styles[key];
    var isObject = typeof style === 'object';

    // check if user passed their own config
    // if not default to regular spring
    rmStyles[key] = isObject ? _extends({}, style) : (0, _reactMotion.spring)(style);
  });

  return rmStyles;
}

module.exports = exports['default'];