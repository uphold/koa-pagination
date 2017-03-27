'use strict';

/**
 * Module dependencies.
 */

const HttpError = require('standard-http-error');

/**
 * Constructor.
 */

module.exports = class RangeNotSatisfiableError extends HttpError {
  constructor() {
    super(416);
  }
};
