
/**
 * Module dependencies.
 */

const HttpError = require('standard-http-error');
const util = require('util');

/**
 * Constructor.
 */

function RangeNotSatisfiableError() {
  HttpError.call(this, 416);
}

/**
 * Inherit from `HttpError`.
 */

util.inherits(RangeNotSatisfiableError, HttpError);

/**
 * Export `RangeNotSatisfiableError`.
 */

module.exports = RangeNotSatisfiableError;
