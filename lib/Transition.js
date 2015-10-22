'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLibShallowCompare = require('react/lib/shallowCompare');

var _reactLibShallowCompare2 = _interopRequireDefault(_reactLibShallowCompare);

var _reactMotion = require('react-motion');

var _reactMeasure = require('react-measure');

var _reactMeasure2 = _interopRequireDefault(_reactMeasure);

var _toRMStyles = require('./to-RM-styles');

var _toRMStyles2 = _interopRequireDefault(_toRMStyles);

var _fromRMStyles = require('./from-RM-styles');

var _fromRMStyles2 = _interopRequireDefault(_fromRMStyles);

var _configToStyle = require('./config-to-style');

var _configToStyle2 = _interopRequireDefault(_configToStyle);

// TODOS:
// - add prop for default styles
// - make prop appear true/false to show animation on mount
//   would pass an empty config to tell RM not to drill into it

var Transition = (function (_Component) {
  _inherits(Transition, _Component);

  function Transition() {
    var _this = this;

    _classCallCheck(this, Transition);

    _get(Object.getPrototypeOf(Transition.prototype), 'constructor', this).apply(this, arguments);

    this._measureWarning = true;
    this.state = {
      dimensions: {}
    };

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
      childStyles = _this._convertAutoValues(childStyles);

      _react.Children.forEach(children, function (child) {
        if (!child) return;
        configs[child.key] = _extends({
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

      // convert to React Motion friendly structure
      var childStyles = (0, _toRMStyles2['default'])(enter);

      _react.Children.forEach(children, function (child) {
        if (!child) return;

        var childDimensions = dimensions && dimensions[child.key];

        if (childStyles.height && childStyles.height.val === 'auto') {
          childStyles.height.val = childDimensions && childDimensions.height || 0;
        }
        if (childStyles.width && childStyles.width.val === 'auto') {
          childStyles.width.val = childDimensions && childDimensions.width || 0;
        }

        configs[child.key] = _extends({
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
      childStyles = _this._convertAutoValues(childStyles);

      // fire entering callback
      onEnter(flatValues);

      return _extends({}, style, (0, _toRMStyles2['default'])(childStyles));
    };

    this._willLeave = function (key, style, endStyles, currentStyles, currentSpeed) {
      var _props4 = _this.props;
      var leave = _props4.leave;
      var onLeave = _props4.onLeave;

      var flatValues = (0, _fromRMStyles2['default'])(currentStyles[key]);

      // clean up dimensions when item leaves
      delete _this.state.dimensions[key];

      // fire leaving callback
      onLeave(flatValues);

      return _extends({}, style, (0, _toRMStyles2['default'])(leave));
    };

    this._storeDimensions = function (key, childDimensions) {
      var dimensions = _this.state.dimensions;

      dimensions[key] = childDimensions;
      _this.setState({ dimensions: dimensions });
    };

    this._childrenToRender = function (currValues) {
      return Object.keys(currValues).map(function (key) {
        var currValue = currValues[key];
        var child = currValue.child;

        var configs = _objectWithoutProperties(currValue, ['child']);

        var childStyles = child.props.style;
        var style = (0, _configToStyle2['default'])(configs);
        var component = null;

        // merge in styles if they we're set by the user
        // Transition styles will take precedence
        if (childStyles) {
          style = _extends({}, childStyles, style);
        }

        // determine whether we need to measure the child or not
        if (_this._shouldMeasure()) {
          var onChange = _this._storeDimensions.bind(null, key);

          component = _react2['default'].createElement(_reactMeasure2['default'], { key: key, clone: true, whitelist: ['width', 'height'], onChange: onChange }, (0, _react.cloneElement)(child, { style: style, dimensions: _this.state.dimensions[key] }));
        } else {
          component = (0, _react.cloneElement)(child, { key: key, style: style });
        }

        return component;
      });
    };
  }

  _createClass(Transition, [{
    key: '_convertAutoValues',

    // shouldComponentUpdate(nextProps, nextState) {
    //   return shallowCompare(this, nextProps, nextState)
    // }

    // convert auto values to a start of 0
    value: function _convertAutoValues(style) {
      var newStyles = _extends({}, style);

      if (style.height === 'auto') {
        newStyles.height = 0;
      }
      if (style.width === 'auto') {
        newStyles.width = 0;
      }

      return newStyles;
    }
  }, {
    key: '_shouldMeasure',
    value: function _shouldMeasure() {
      var _props5 = this.props;
      var measure = _props5.measure;
      var enter = _props5.enter;

      // warn against trying to use auto props without measure enabled
      if (!measure && this._measureWarning) {
        if (enter.width === 'auto' || enter.height === 'auto') {
          console.warn('Warning: "measure" prop needs to be enabled when using auto values https://github.com/souporserious/react-motion-ui-pack#props');
          this._measureWarning = false;
        }
      }

      return measure;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props6 = this.props;
      var component = _props6.component;
      var onlyChild = _props6.onlyChild;
      var appear = _props6.appear;

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

          if (onlyChild) {
            if (children.length === 1) {
              wrapper = _react.Children.only(children[0]);
            } else {
              wrapper = (0, _react.createElement)(component, { style: { display: 'none' } });
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
      component: _react.PropTypes.string,
      onlyChild: _react.PropTypes.bool,
      measure: _react.PropTypes.bool,
      appear: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.object]),
      enter: _react.PropTypes.object,
      leave: _react.PropTypes.object,
      onEnter: _react.PropTypes.func,
      onLeave: _react.PropTypes.func
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      component: 'div', // define the wrapping tag around the elements you want to transition in/out
      measure: false, // pass true to use measure and get child dimensions to use with your animations
      runOnMount: true,
      enter: {
        opacity: 1
      },
      leave: {
        opacity: 0
      },
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