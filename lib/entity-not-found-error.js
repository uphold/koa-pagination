
/**
 * Module dependencies.
 */

var _ = require('lodash');
var errors = require('create-error');

/**
 * Export `EntityNotFound`.
 */

module.exports = (function(attributes) {
  return errors('EntityNotFound', _.extend({ status: 404 }, attributes));
}());
