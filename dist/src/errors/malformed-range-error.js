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

class MalformedRangeError extends _standardHttpError2.default {
  constructor() {
    super(412, { message: 'Malformed Range Error' });
  }
}
exports.default = MalformedRangeError;
/**
 * Module dependencies.
 */