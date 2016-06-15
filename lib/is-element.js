'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isElement;

var _react = require('react');

function isElement(props, propName, componentName) {
  if (typeof props[propName] !== 'function') {
    if ((0, _react.isValidElement)(props[propName])) {
      return new Error(ComponentName + ' is not an actual Element');
    }
  }
}

module.exports = exports['default'];