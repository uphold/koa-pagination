
/**
 * Module dependencies.
 */

var errors = require('create-error');

/**
 * Export `MissingOtpTokenError`.
 */

module.exports = errors('MissingOtpTokenError', { status: 401 });
