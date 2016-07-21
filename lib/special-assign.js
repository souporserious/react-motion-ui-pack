"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = specialAssign;

function specialAssign(a, b, reserved) {
  for (var x in b) {
    if (!b.hasOwnProperty(x) || reserved[x]) continue;
    a[x] = b[x];
  }
  return a;
}

module.exports = exports["default"];