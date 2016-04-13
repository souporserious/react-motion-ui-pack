// spread values to avoid mutation
// convert any auto values to a start of 0
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = cloneStyles;

function cloneStyles(style) {
  var width = style.width;
  var height = style.height;

  var newStyle = _extends({}, style);

  if (width) {
    if (width.val && width.val === 'auto') {
      newStyle.width = _extends({}, newStyle.width, { val: 0 });
    } else if (width === 'auto') {
      newStyle.width = 0;
    }
  }

  if (height) {
    if (height.val && height.val === 'auto') {
      newStyle.height = _extends({}, newStyle.height, { val: 0 });
    } else if (height === 'auto') {
      newStyle.height = 0;
    }
  }

  return newStyle;
}

module.exports = exports['default'];