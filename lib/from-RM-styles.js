"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = fromRMStyles;

function fromRMStyles(config) {
  var values = {};

  Object.keys(config).forEach(function (key) {
    var value = config[key].val;

    if (!isNaN(value)) {
      values[key] = value;
    }
  });

  return values;
}

module.exports = exports["default"];