'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

function isElement(props, propName, componentName) {
  if (typeof props[propName] !== 'function') {
    if ((0, _react.isValidElement)(props[propName])) {
      return new Error(ComponentName + ' is not an actual Element');
    }
  }
}

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

      if (runOnMount) {
        childStyles = appear || leave;
      }

      // convert auto values and map to new object to avoid mutation
      childStyles = (0, _cloneStyles2['default'])(childStyles);

      return _react.Children.map(children, function (child) {
        return child && {
          key: child.key,
          data: child,
          style: _extends({}, childStyles)
        };
      });
    };

    this._getStyles = function () {
      var dimensions = _this.state.dimensions;
      var _props2 = _this.props;
      var children = _props2.children;
      var enter = _props2.enter;

      return _react.Children.map(children, function (child) {
        // if null is being passed, bail out
        if (!child) return;

        var key = child.key;

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

        if (!key) {
          throw new Error('You must provide a key for every child of Transition.');
        } else {
          return {
            key: key,
            data: child,
            style: _extends({}, childStyles)
          };
        }
      });
    };

    this._willEnter = function (_ref) {
      var key = _ref.key;
      var style = _ref.style;
      var _props3 = _this.props;
      var appear = _props3.appear;
      var leave = _props3.leave;
      var onEnter = _props3.onEnter;

      var childStyles = typeof appear === 'object' ? appear : leave;

      // convert auto values and map to new object to avoid mutation
      childStyles = (0, _cloneStyles2['default'])(childStyles);

      // fire entering callback
      onEnter(childStyles);

      return _extends({}, style, childStyles);
    };

    this._willLeave = function (_ref2) {
      var key = _ref2.key;
      var style = _ref2.style;
      var _props4 = _this.props;
      var leave = _props4.leave;
      var onLeave = _props4.onLeave;

      //const flatValues = fromRMStyles(currentStyles[key])

      // TODO: when RM implements onEnd callback do cleanup
      // clean up dimensions when item leaves
      // if (this.state.dimensions[key]) {
      //   delete this.state.dimensions[key]
      // }

      // fire leaving callback
      onLeave(style);

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
      return currValues.map(function (_ref3) {
        var key = _ref3.key;
        var data = _ref3.data;
        var style = _ref3.style;

        var child = data;
        var childStyle = child.props.style;
        var dimensions = _this.state.dimensions && _this.state.dimensions[key];

        // convert styles to a friendly structure
        style = (0, _configToStyle2['default'])(style);

        var currHeight = style.height;

        // if height is being animated we'll want to
        // ditch it after it's reached its destination
        if (dimensions && currHeight) {
          var destHeight = parseFloat(dimensions.height).toFixed(4);

          if (destHeight > 0 && destHeight !== currHeight) {
            style = _extends({}, style, {
              height: currHeight
            });
          } else {
            style = _extends({}, style, {
              height: ''
            });
          }
        }

        // merge in any styles set by the user
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
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var _props5 = this.props;
      var children = _props5.children;
      var runOnMount = _props5.runOnMount;

      if (runOnMount) return;

      // render things instantly when runOnMount is set to `false`
      _react.Children.forEach(children, function (child) {
        if (!child) return;
        var key = child.key || _this2._onlyKey;
        _this2._instant[key] = true;
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props6 = this.props;
      var component = _props6.component;
      var props = _props6.props;

      return _react2['default'].createElement(
        _reactMotion.TransitionMotion,
        {
          defaultStyles: this._getDefaultStyles(),
          styles: this._getStyles(),
          willEnter: this._willEnter,
          willLeave: this._willLeave
        },
        function (currValues) {
          var children = _this3._childrenToRender(currValues);
          var wrapper = null;

          if (!component || component === 'false') {
            if (_react.Children.count(children) === 1) {
              wrapper = _react.Children.only(children[0]);
            } else {
              wrapper = (0, _react.createElement)('span', { style: { display: 'none' } });
            }
          } else {
            wrapper = (0, _react.createElement)(component, props, children);
          }

          return wrapper;
        }
      );
    }
  }], [{
    key: 'propTypes',
    value: {
      component: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.bool, isElement]),
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