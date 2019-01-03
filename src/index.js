'use strict';

/**
 * Module dependencies.
 */

const contentRangeFormat = require('http-content-range-format');
const errors = require('./errors');
const rangeSpecifierParser = require('range-specifier-parser').default;

/**
 * Instances.
 */

const { InvalidConfigurationError, MalformedRangeError, RangeNotSatisfiableError } = errors;

/**
 * Paginate middleware.
 */

function middleware({ allowAll = true, maximum = 50, unit = 'items' } = {}) {
  return async function paginate(ctx, next) {
    let first = 0;
    let last = maximum;
    let limit = '*';

    // Prevent invalid `maximum` value configuration.
    if (!isFinite(maximum) || !Number.isSafeInteger(maximum) || maximum <= 0) {
      throw new InvalidConfigurationError();
    }

    // Handle `Range` header.
    if (ctx.get('Range')) {
      const range = rangeSpecifierParser(ctx.get('Range'));

      if (range === -1) {
        throw new RangeNotSatisfiableError();
      }

      if (range === -2) {
        throw new MalformedRangeError();
      }

      if (range.unit !== unit) {
        throw new MalformedRangeError();
      }

      // Update `limit`, `offset` values.
      first = range.first;
      last = range.last;

      if (!allowAll && last === '*') {
        throw new RangeNotSatisfiableError();
      }

      if (!Number.isSafeInteger(first) || last !== '*' && !Number.isSafeInteger(last)) {
        throw new RangeNotSatisfiableError();
      }
    }

    if (Number.isSafeInteger(last)) {
      // Prevent pages to be longer than allowed.
      if (last - first + 1 > maximum) {
        last = first + maximum - 1;
      }

      // Calculate limit in the specified range.
      limit = last - first + 1;
    }

    // Set pagination object on context.
    ctx.pagination = {
      limit,
      offset: first,
      unit
    };

    await next();

    const length = ctx.pagination.length;

    // Prevent nonexistent pages.
    if (first > length - 1 && length > 0) {
      throw new RangeNotSatisfiableError();
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

    // Set response headers based on available units.
    ctx.set('Accept-Ranges', unit);
    ctx.set('Content-Range', contentRangeFormat({ first, last, length, unit }));

    // Allow non-successful status codes.
    if (ctx.status < 200 || ctx.status > 300) {
      return;
    }

    // Set the response as `Partial Content`.
    ctx.status = 206;
  };
}

/**
 * Exports.
 */

module.exports = { errors, middleware };
