'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$allowAll = _ref.allowAll;
  let

  /**
   * Export `PagerMiddleware`.
   */

  allowAll = _ref$allowAll === undefined ? true : _ref$allowAll;
  var _ref$maximum = _ref.maximum;
  let maximum = _ref$maximum === undefined ? 50 : _ref$maximum;
  var _ref$unit = _ref.unit;
  let unit = _ref$unit === undefined ? 'items' : _ref$unit;

  return (() => {
    var ref = _asyncToGenerator(function* (ctx, next) {
      let first = 0;
      let last = maximum;
      let limit = '*';

      // Prevent invalid `maximum` value configuration.
      if (!isFinite(maximum) || !(0, _isSafeInteger2.default)(maximum) || maximum <= 0) {
        throw new _invalidConfigurationError2.default();
      }

      // Handle `Range` header.
      if (ctx.get('Range')) {
        const range = (0, _rangeSpecifierParser2.default)(ctx.get('Range'));

        if (range === -1) {
          throw new _rangeNotSatisfiableError2.default();
        }

        if (range === -2) {
          throw new _malformedRangeError2.default();
        }

        // Update `limit`, `offset` and `unit` values.
        first = range.first;
        last = range.last;
        unit = range.unit;

        if (!allowAll && last === '*') {
          throw new _rangeNotSatisfiableError2.default();
        }

        if (!(0, _isSafeInteger2.default)(first) || last !== '*' && !(0, _isSafeInteger2.default)(last)) {
          throw new _rangeNotSatisfiableError2.default();
        }
      }

      if ((0, _isSafeInteger2.default)(last)) {
        // Prevent pages to be longer than allowed.
        if (last - first + 1 > maximum) {
          last = first + maximum - 1;
        }

        // Calculate limit in the specified range.
        limit = last - first + 1;
      }

      // Set pagination object on context.
      ctx.pagination = {
        limit: limit,
        offset: first,
        unit: unit
      };

      yield next();

      const length = ctx.pagination.length;

      // Prevent nonexistent pages.
      if (first > length - 1 && length > 0) {
        throw new _rangeNotSatisfiableError2.default();
      }

      // Set the calculated `last` value.
      if (last === '*') {
        last = length;
      }

      // Fix `last` value if `length` is lower.
      if (last + 1 > length && length !== 0) {
        last = length - 1;
      }

      // Set `byte-range-spec` to undefined value - `*`.
      if (length === 0) {
        first = undefined;
        last = undefined;
      }

      // Set `Content-Range` based on available units.
      ctx.set('Content-Range', (0, _httpContentRangeFormat2.default)({ first: first, last: last, length: length, unit: unit }));

      // Set the response as `Partial Content`.
      if (ctx.get('Range')) {
        ctx.status = 206;
      }
    });

    return function (_x2, _x3) {
      return ref.apply(this, arguments);
    };
  })();
};

var _invalidConfigurationError = require('./errors/invalid-configuration-error');

var _invalidConfigurationError2 = _interopRequireDefault(_invalidConfigurationError);

var _malformedRangeError = require('./errors/malformed-range-error');

var _malformedRangeError2 = _interopRequireDefault(_malformedRangeError);

var _rangeNotSatisfiableError = require('./errors/range-not-satisfiable-error');

var _rangeNotSatisfiableError2 = _interopRequireDefault(_rangeNotSatisfiableError);

var _httpContentRangeFormat = require('http-content-range-format');

var _httpContentRangeFormat2 = _interopRequireDefault(_httpContentRangeFormat);

var _isSafeInteger = require('is-safe-integer');

var _isSafeInteger2 = _interopRequireDefault(_isSafeInteger);

var _rangeSpecifierParser = require('range-specifier-parser');

var _rangeSpecifierParser2 = _interopRequireDefault(_rangeSpecifierParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
/**
 * Module dependencies.
 */