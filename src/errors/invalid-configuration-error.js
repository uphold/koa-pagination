'use strict';

/**
 * Module dependencies.
 */

const HttpError = require('standard-http-error');

/**
 * Constructor.
 */

module.exports = class InvalidConfigurationError extends HttpError {};
