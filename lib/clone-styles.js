// spread values to avoid mutation
// convert any auto values to a start of 0
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = cloneStyles;

function cloneStyles(style) {
  var newStyle = _extends({}, style);

  if (style.height === 'auto') {
    newStyle.height = 0;
  }

  if (style.width === 'auto') {
    newStyle.width = 0;
  }

  return newStyle;
}

module.exports = exports['default'];