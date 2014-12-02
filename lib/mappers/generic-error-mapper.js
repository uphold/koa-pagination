
/**
 * Module dependencies.
 */

var InvalidArgumentError = require('../invalid-argument-error');
var http = require('http');
var snakeCase = require('snake-case');

/**
 * Export `GenericErrorMapper`.
 */

module.exports = {
  map: function(e) {
    if (!(e instanceof Error)) {
      throw new InvalidArgumentError('Exception is not an instance of `Error`');
    }

    var code;
    var message;

    code = message = http.STATUS_CODES[500];

    if (500 > e.status) {
      code = http.STATUS_CODES[e.status];
      message = http.STATUS_CODES[e.status];
    }

    return {
      code: snakeCase(code),
      message: message
    };
  }
};
