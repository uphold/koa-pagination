
/**
 * Module dependencies.
 */

const HttpError = require('standard-http-error');
const util = require('util');

/**
 * Constructor.
 */

function MalformedRangeError(message, properties) {
  HttpError.call(this, 412, message, properties);
}

/**
 * Inherit from `HttpError`.
 */

util.inherits(MalformedRangeError, HttpError);

/**
 * Export `MalformedRangeError`.
 */

module.exports = MalformedRangeError;
