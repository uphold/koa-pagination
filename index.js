
/**
 * Module dependencies.
 */

var _ = require('lodash');
var MalformedRangeError = require('./errors/malformed-range-error');
var RangeNotSatisfiableError = require('./errors/range-not-satisfiable-error');
var contentRangeFormat = require('http-content-range-format');
var rangeSpecifierParser = require('range-specifier-parser');

/**
 * Export `PagerMiddleware`.
 */

module.exports = function(options) {
  options = _.assign({
    maximum: 50
  }, options);

  return function *paginate(next) {
    var first = 0;
    var last = options.maximum;
    var maximum = options.maximum;
    var unit = 'bytes';

    // Handle `Range` header.
    if (this.get('Range')) {
      var range = rangeSpecifierParser(this.get('Range'));

      if (range === -1) {
        throw new RangeNotSatisfiableError();
      }

      if (range === -2) {
        throw new MalformedRangeError();
      }

      // Update `limit` and `offset` values.
      first = range.first;
      last = range.last;
      unit = range.unit;
    }

    // Set pagination object on context.
    this.pagination = {
      limit: last + 1,
      offset: first
    };

    // Prevent pages with more items than allowed.
    if ((last - first + 1) > maximum) {
      last = first + maximum - 1;
    }

    yield* next;

    var length = this.pagination.length;

    // Fix `last` value if `length` is lower.
    if (last > length) {
      last = length - 1;
    }

    // Set `Content-Range` based on available items.
    this.set('Content-Range', contentRangeFormat({
      first: first,
      last: last,
      length: length,
      unit: unit
    }));

    // Set the response as `Partial Content`.
    this.status = 206;
  };
};
