
/**
 * Module dependencies.
 */

var errors = require('create-error');

/**
 * Export `InvalidRangeError`.
 */

module.exports = errors('InvalidRangeError', { status: 412 });
