
/**
 * Module dependencies.
 */

import InvalidConfigurationError from './errors/invalid-configuration-error';
import MalformedRangeError from './errors/malformed-range-error';
import RangeNotSatisfiableError from './errors/range-not-satisfiable-error';
import contentRangeFormat from 'http-content-range-format';
import isSafeInteger from 'is-safe-integer';
import rangeSpecifierParser from 'range-specifier-parser';

/**
 * Export `PagerMiddleware`.
 */

export default function({ allowAll = true, maximum = 50, unit = 'items' } = {}) {
  return function *paginate(next) {
    let first = 0;
    let last = maximum;
    let limit = '*';

    // Prevent invalid `maximum` value configuration.
    if (!isFinite(maximum) || !isSafeInteger(maximum) || maximum <= 0) {
      throw new InvalidConfigurationError();
    }

    // Handle `Range` header.
    if (this.get('Range')) {
      const range = rangeSpecifierParser(this.get('Range'));

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

      if (!allowAll && last === '*') {
        throw new RangeNotSatisfiableError();
      }

      if (!isSafeInteger(first) || last !== '*' && !isSafeInteger(last)) {
        throw new RangeNotSatisfiableError();
      }
    }

    if (isSafeInteger(last)) {
      // Prevent pages to be longer than allowed.
      if (last - first + 1 > maximum) {
        last = first + maximum - 1;
      }

      // Calculate limit in the specified range.
      limit = last - first + 1;
    }

    // Set pagination object on context.
    this.pagination = {
      limit,
      offset: first,
      unit
    };

    yield* next;

    const length = this.pagination.length;

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

    // Set `Content-Range` based on available units.
    this.set('Content-Range', contentRangeFormat({ first, last, length, unit }));

    // Set the response as `Partial Content`.
    if (this.get('Range')) {
      this.status = 206;
    }
  };
}
