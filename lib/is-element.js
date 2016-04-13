'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isElement;

function isElement(props, propName, componentName) {
  if (typeof props[propName] !== 'function') {
    if (isValidElement(props[propName])) {
      return new Error(ComponentName + ' is not an actual Element');
    }
  }
}

module.exports = exports['default'];