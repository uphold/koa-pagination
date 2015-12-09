
/**
 * Module dependencies.
 */

const HttpError = require('standard-http-error');
const util = require('util');

/**
 * Constructor.
 */

function RangeNotSatisfiableError(message, properties) {
  HttpError.call(this, 416, message, properties);
}

/**
 * Inherit from `HttpError`.
 */

util.inherits(RangeNotSatisfiableError, HttpError);

/**
 * Export `RangeNotSatisfiableError`.
 */

module.exports = RangeNotSatisfiableError;
