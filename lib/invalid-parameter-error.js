
/**
 * Module dependencies.
 */

var errors = require('create-error');

/**
 * Export `InvalidParameter`.
 */

module.exports = errors('InvalidParameter', { status: 412, exposeMessage: true });
