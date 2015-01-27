
/**
 * Module dependencies.
 */

var errors = require('create-error');

/**
 * Export `RangeNotSatisfiableError`.
 */

module.exports = errors('RangeNotSatisfiableError', { status: 416 });
