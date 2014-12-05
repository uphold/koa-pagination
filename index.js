
/**
 * Module dependencies.
 */

var AccessForbiddenError = require('./lib/access-forbidden-error');
var EntityNotFoundError = require('./lib/entity-not-found-error');
var GenericErrorMapper = require('./lib/mappers/generic-error-mapper');
var InvalidArgumentError = require('./lib/invalid-argument-error');
var InvalidParameterError = require('./lib/invalid-parameter-error');
var MaskNotFoundError = require('./lib/mask-not-found-error');
var MissingOtpTokenError = require('./lib/missing-otp-token-error');
var ValidationErrorMapper = require('./lib/mappers/validation-error-mapper');
var ValidationFailedError = require('./lib/validation-failed-error');

/**
 * Export `Errors`.
 */

module.exports = {
  mappers: {
    GenericErrorMapper: GenericErrorMapper,
    ValidationErrorMapper: ValidationErrorMapper
  },
  AccessForbiddenError: AccessForbiddenError,
  EntityNotFoundError: EntityNotFoundError,
  InvalidArgumentError: InvalidArgumentError,
  InvalidParameterError: InvalidParameterError,
  MaskNotFoundError: MaskNotFoundError,
  MissingOtpTokenError: MissingOtpTokenError,
  ValidationFailedError: ValidationFailedError
};
