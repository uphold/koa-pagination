
/**
 * Module dependencies.
 */

const HttpError = require('standard-http-error');
const util = require('util');

/**
 * Constructor.
 */

function InvalidConfigurationError() {
  HttpError.call(this);
}

/**
 * Inherit from `HttpError`.
 */

util.inherits(InvalidConfigurationError, HttpError);

/**
 * Export `InvalidConfigurationError`.
 */

module.exports = InvalidConfigurationError;
