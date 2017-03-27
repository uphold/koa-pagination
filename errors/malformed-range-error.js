'use strict';

/**
 * Module dependencies.
 */

const HttpError = require('standard-http-error');

/**
 * Constructor.
 */

module.exports = class MalformedRangeError extends HttpError {
  constructor() {
    super(412, { message: 'Malformed Range Error' });
  }
};
