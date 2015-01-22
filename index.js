
/**
 * Module dependencies.
 */

var _ = require('lodash');
var InvalidRangeError = require('./errors/invalid-range-error');
var MalformedRangeError = require('./errors/malformed-range-error');
var contentRange = require('content-range');
var parseRange = require('range-parser');

/**
 * Export `PagerMiddleware`.
 */

module.exports = function(options) {
  options = _.assign({
    limit: 20,
    maximum: 50
  }, options);

  return function *paginate(next) {
    // Ensure that `limit` is never higher than `maximum`.
    var limit = options.limit > options.maximum ? options.maximum : options.limit;
    var maximum = options.maximum;
    var offset = 0;

    if (this.get('Range')) {
      var range = parseRange(maximum + 1, this.get('Range'));

      if (range === -1) {
        throw new InvalidRangeError();
      }

      if (range === -2) {
        throw new MalformedRangeError();
      }

      // Update `limit` and `offset` values.
      limit = range[0].end;
      offset = range[0].start;
    }

    // Set range values on context.
    this.pagination = {
      limit: limit,
      offset: offset
    };

    yield* next;

    // Fix limit value if is higher than count.
    if (limit > this.pagination.count) {
      limit = this.pagination.count;
    }

    // Set `Content-Range` based on available items.
    this.set('Content-Range', contentRange.format({
      count: this.pagination.count,
      limit: limit,
      name: 'items',
      offset: this.pagination.offset
    }));
  };
};
