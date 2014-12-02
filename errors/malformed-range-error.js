
/**
 * Module dependencies.
 */

var errors = require('create-error');

/**
 * Export `MalformedRangeError`.
 */

module.exports = errors('MalformedRangeError', { status: 412 });
