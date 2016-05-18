'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _standardHttpError = require('standard-http-error');

var _standardHttpError2 = _interopRequireDefault(_standardHttpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Constructor.
 */

class InvalidConfigurationError extends _standardHttpError2.default {}
exports.default = InvalidConfigurationError;
/**
 * Module dependencies.
 */