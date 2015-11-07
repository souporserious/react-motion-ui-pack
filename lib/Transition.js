'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMotion = require('react-motion');

var _cloneStyles = require('./clone-styles');

var _cloneStyles2 = _interopRequireDefault(_cloneStyles);

var _toRMStyles = require('./to-RM-styles');

var _toRMStyles2 = _interopRequireDefault(_toRMStyles);

var _fromRMStyles = require('./from-RM-styles');

var _fromRMStyles2 = _interopRequireDefault(_fromRMStyles);

var _configToStyle = require('./config-to-style');

var _configToStyle2 = _interopRequireDefault(_configToStyle);

var _TransitionChild = require('./TransitionChild');

var _TransitionChild2 = _interopRequireDefault(_TransitionChild);

var Transition = (function (_Component) {
  _inherits(Transition, _Component);

  function Transition() {
    var _this = this;

    _classCallCheck(this, Transition);

    _get(Object.getPrototypeOf(Transition.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      dimensions: {}
    };
    this._onlyKey = Date.now();
    this._instant = {};

    this._getDefaultStyles = function () {
      var _props = _this.props;
      var children = _props.children;
      var runOnMount = _props.runOnMount;
      var appear = _props.appear;
      var enter = _props.enter;
      var leave = _props.leave;

      var childStyles = enter;
      var configs = {};

      if (runOnMount) {
        childStyles = appear || leave;
      }

      // convert auto values and map to new object to avoid mutation
      childStyles = (0, _cloneStyles2['default'])(childStyles);

      _react.Children.forEach(children, function (child) {
        if (!child) return;

        var key = child.key || _this._onlyKey;

        configs[key] = _extends({
          child: child
        }, childStyles);
      });

      return configs;
    };

    this._getEndStyles = function () {
      var dimensions = _this.state.dimensions;
      var _props2 = _this.props;
      var children = _props2.children;
      var enter = _props2.enter;

      var configs = {};

      _react.Children.forEach(children, function (child) {
        if (!child) return;

        var key = child.key || _this._onlyKey;
        var childDimensions = dimensions && dimensions[key];

        // convert to React Motion friendly structure
        var childStyles = (0, _toRMStyles2['default'])(enter);

        if (enter.width && (enter.width === 'auto' || enter.width.val === 'auto')) {
          childStyles.width.val = childDimensions ? childDimensions.width : 0;
        }

        if (enter.height && (enter.height === 'auto' || enter.height.val === 'auto')) {
          var height = childDimensions ? childDimensions.height : 0;

          // if instant, apply the height directly rather than through RM
          if (_this._instant[key]) {
            childStyles.height = height;

            // it only needs to be instant for one render
            // to prime RM for the next height transition
            // so we set it back to false
            _this._instant[key] = false;
          } else {
            childStyles.height.val = height;
          }
        }

        configs[key] = _extends({
          child: child
        }, childStyles);
      });

      return configs;
    };

    this._willEnter = function (key, style, endStyles, currentStyles, currentSpeed) {
      var _props3 = _this.props;
      var appear = _props3.appear;
      var leave = _props3.leave;
      var onEnter = _props3.onEnter;

      var flatValues = (0, _fromRMStyles2['default'])(endStyles[key]);
      var childStyles = typeof appear === 'object' ? appear : leave;

      // convert auto values and map to new object to avoid mutation
      childStyles = (0, _cloneStyles2['default'])(childStyles);

      // fire entering callback
      onEnter(flatValues);

      return _extends({}, style, (0, _toRMStyles2['default'])(childStyles));
    };

    this._willLeave = function (key, style, endStyles, currentStyles, currentSpeed) {
      var _props4 = _this.props;
      var leave = _props4.leave;
      var onLeave = _props4.onLeave;

      var flatValues = (0, _fromRMStyles2['default'])(currentStyles[key]);

      // TODO: when RM implements onEnd callback do cleanup
      // clean up dimensions when item leaves
      // if (this.state.dimensions[key]) {
      //   delete this.state.dimensions[key]
      // }

      // fire leaving callback
      onLeave(flatValues);

      return _extends({}, style, (0, _toRMStyles2['default'])(leave));
    };

    this._storeDimensions = function (key, childDimensions, mutations) {
      var dimensions = _this.state.dimensions;

      // if any mutations, set instantly
      if (mutations) {
        _this._instant[key] = true;
      }

      // store child dimensions
      dimensions[key] = childDimensions;

      // update state with new dimensions
      _this.setState({ dimensions: dimensions });
    };

    this._childrenToRender = function (currValues) {
      return Object.keys(currValues).map(function (key) {
        var _currValues$key = currValues[key];
        var child = _currValues$key.child;

        var configs = _objectWithoutProperties(_currValues$key, ['child']);

        var dimensions = _this.state.dimensions[key];
        var childStyle = child.props.style;
        var style = (0, _configToStyle2['default'])(configs);
        var currHeight = style.height;

        // if height is being animated we'll want to ditch it
        // after it's reached its destination
        if (dimensions && currHeight) {
          var destHeight = parseFloat(dimensions.height).toFixed(4);

          if (destHeight > 0 && destHeight !== currHeight) {
            style = _extends({}, style, {
              height: currHeight,
              overflow: 'hidden'
            });
          } else {
            style = _extends({}, style, {
              height: ''
            });
          }
        }

        // merge in styles if they we're set by the user
        // Transition styles will take precedence
        if (childStyle) {
          style = _extends({}, childStyle, style);
        }

        return _react2['default'].createElement(_TransitionChild2['default'], {
          key: key,
          child: child,
          style: style,
          dimensions: dimensions,
          onMeasure: _this._storeDimensions.bind(null, key)
        });
      });
    };
  }

  _createClass(Transition, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props5 = this.props;
      var component = _props5.component;
      var appear = _props5.appear;

      return _react2['default'].createElement(
        _reactMotion.TransitionMotion,
        {
          defaultStyles: this._getDefaultStyles(),
          styles: this._getEndStyles(),
          willEnter: this._willEnter,
          willLeave: this._willLeave
        },
        function (currValues) {
          var children = _this2._childrenToRender(currValues);
          var wrapper = null;

          if (!component || component === 'false') {
            if (children.length === 1) {
              wrapper = _react.Children.only(children[0]);
            } else {
              wrapper = (0, _react.createElement)('span', { style: { display: 'none' } });
            }
          } else {
            wrapper = (0, _react.createElement)(component, _this2.props, children);
          }

          return wrapper;
        }
      );
    }
  }], [{
    key: 'propTypes',
    value: {
      component: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.bool]),
      runOnMount: _react.PropTypes.bool,
      appear: _react.PropTypes.object,
      enter: _react.PropTypes.object,
      leave: _react.PropTypes.object,
      onEnter: _react.PropTypes.func,
      onLeave: _react.PropTypes.func
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      component: 'div',
      runOnMount: true,
      enter: { opacity: 1 },
      leave: { opacity: 0 },
      onEnter: function onEnter() {
        return null;
      },
      onLeave: function onLeave() {
        return null;
      }
    },
    enumerable: true
  }]);

  return Transition;
})(_react.Component);

exports['default'] = Transition;
module.exports = exports['default'];