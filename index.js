
/**
 * Module dependencies.
 */

var _ = require('lodash');
var InvalidConfigurationError = require('./errors/invalid-configuration-error');
var MalformedRangeError = require('./errors/malformed-range-error');
var RangeNotSatisfiableError = require('./errors/range-not-satisfiable-error');
var contentRangeFormat = require('http-content-range-format');
var isSafeInteger = require('is-safe-integer');
var rangeSpecifierParser = require('range-specifier-parser');

/**
 * Export `PagerMiddleware`.
 */

module.exports = function(options) {
  options = _.assign({
    maximum: 50,
    unit: 'items'
  }, options);

  return function *paginate(next) {
    var first = 0;
    var last = options.maximum;
    var maximum = options.maximum;
    var unit = options.unit;

    // Prevent invalid `maximum` value configuration.
    if (!_.isFinite(maximum) || !isSafeInteger(maximum) || maximum <= 0) {
      throw new InvalidConfigurationError();
    }

    // Handle `Range` header.
    if (this.get('Range')) {
      var range = rangeSpecifierParser(this.get('Range'));

      if (range === -1) {
        throw new RangeNotSatisfiableError();
      }

      if (range === -2) {
        throw new MalformedRangeError();
      }

      // Update `limit`, `offset` and `unit` values.
      first = range.first;
      last = range.last;
      unit = range.unit;

      if (!isSafeInteger(first) || !isSafeInteger(last)) {
        throw new RangeNotSatisfiableError();
      }
    }

    // Prevent pages to be longer than allowed.
    if ((last - first + 1) > maximum) {
      last = first + maximum - 1;
    }

    // Set pagination object on context.
    this.pagination = {
      limit: last - first + 1,
      offset: first
    };

    yield* next;

    var length = this.pagination.length;

    // Prevent nonexistent pages.
    if (first > length - 1 && length > 0) {
      throw new RangeNotSatisfiableError();
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
    this.set('Content-Range', contentRangeFormat({
      first: first,
      last: last,
      length: length,
      unit: unit
    }));

    // Set the response as `Partial Content`.
    if (this.get('Range')) {
      this.status = 206;
    }
  };
};
