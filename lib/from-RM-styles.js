"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = fromRMStyles;

function fromRMStyles(config) {
  var values = {};

  Object.keys(config).forEach(function (key) {
    var value = config[key];
    values[key] = !isNaN(value) ? value : value.val;
  });

  return values;
}

module.exports = exports["default"];