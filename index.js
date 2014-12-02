
/**
 * Module dependencies.
 */

var _ = require('lodash');
var util = require('util');

/**
 * Export `PagerMiddleware`.
 */

module.exports = function(options) {
  options = _.extend({
    maximum: 50
  }, options);

  return function *paginate(next) {
    var contentRange;
    var from;
    var limit;
    var range;
    var to;

    if (this.get('Range')) {
      range = this.get('Range').split('-');

      // Invalid range configuration.
      if (2 !== _.size(range)) {
        this.throw(400, 'Range header should have the following configuration: `from-to`.');
      }

      from = parseInt(range[0]);
      to = parseInt(range[1]);

      // Invalid range configuration.
      if (isNaN(from) || isNaN(to)) {
        this.throw(400, 'Range header values must be valid numbers.');
      }

      // Calculate limit value.
      limit = to - from;

      // Invalid range beacon.
      if (limit >= options.maximum) {
        this.throw(400, util.format('Can\'t request more than %d items.', options.maximum));
      }

      // Set range values on context.
      this.pagination = {
        limit: limit + 1,
        offset: from
      };
    }

    yield *next;

    // Set Content Range header if range and count are defined.
    if (this.get('Range') && undefined !== this.count) {
      // Handle content range based on available items.
      contentRange = '*/0';

      if (0 < this.count) {
        contentRange = util.format('%d-%d/%d', from, to, this.count);
      }

      this.set('Accept-Ranges', 'items');
      this.set('Access-Control-Expose-Headers', 'Accept-Ranges, Content-Range, Range-Unit');
      this.set('Content-Range', contentRange);
      this.set('Range-Unit', 'items');
    }
  };
};
