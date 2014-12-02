
/**
 * Module dependencies.
 */

var errors = require('create-error');

/**
 * Export `AccessForbiddenError`.
 */

module.exports = errors('AccessForbiddenError', { status: 403 });
