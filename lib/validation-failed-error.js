
/**
 * Module dependencies.
 */

var errors = require('create-error');

/**
 * Export `ValidationFailed`.
 */

module.exports = errors('ValidationFailed', { status: 400 });
