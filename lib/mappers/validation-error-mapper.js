
/**
 * Module dependencies.
 */

var _ = require('lodash');
var BigNumber = require('bignumber.js');
var InvalidArgumentError = require('../invalid-argument-error');
var ValidationFailedError = require('../validation-failed-error');
var Validator = require('validator.js');
var ValidatorHavePropertyAssert = new Validator.Assert().HaveProperty();
var messages = require('./validation-error-messages');
var sf = require('sf');
var snakeCase = require('snake-case');

/**
 * Maps a violation to a well-formatted object with
 * support for arguments.
 */

function mapViolation(violation) {
  var mapping = messages[violation.assert.__class__] || messages.Generic;

  var output =  {
    code: mapping.code,
    message: mapping.message
  };

  if (mapping && mapping.args) {
    output.args = {};

    mapping.args.forEach(function(arg) {
      if (_.isUndefined(violation.assert[arg])) {
        return;
      }

      var argument = violation.assert[arg];

      if (argument instanceof BigNumber) {
        argument = argument.toString();
      }

      output.args[arg] = argument;
    });

    if (_.isEmpty(output.args)) {
      delete output.args;
    }
  }

  if (mapping && mapping.message) {
    // Replace message tokens by actual values.
    output.message = sf(mapping.message, violation.assert || {});
  }

  return output;
}

/**
 * Export `ValidationErrorMapper`.
 */

module.exports = {

  /**
   * Map a ValidationFailedError to a consistent API error
   */

  map: function(e) {
    if (!(e instanceof ValidationFailedError)) {
      throw new InvalidArgumentError('Exception is not an instance of `ValidationFailedError`');
    }

    var mapViolations = function mapViolations(value) {
      // If we have a `Violation`, return its mapped representation. Do not
      // test by instance type (`value instanceof Violation`) because a
      // different package version (e.g. validator.js@0.6.1 vs
      // validator.js@1.0.0) will fail this test. Regardless, we only need to
      // make sure that the `assert` property has the data needed for mapping
      // the violation correctly.
      if (value && value.assert && value.assert.__class__) {
        // Deal with the special `HaveProperty` case since validator.js does
        // not throw a `Violation` with an array of errors but, instead, a
        // single key object. For consistency with all other errors, we force
        // an array on the output.
        if (ValidatorHavePropertyAssert.__class__ === value.assert.__class__) {
          return [mapViolation(value)];
        }

        return mapViolation(value);
      }

      // If we have an array, enter the recursion and return an array
      // of mapped violations.
      if (_.isArray(value)) {
        return _.map(value, mapViolations);
      }

      // Otherwise, enter the recursion and return an object with values
      // of mapped violations.
      return { code: snakeCase(e.name), errors: _.mapValues(value, mapViolations) };
    };

    return mapViolations(e.errors);
  }
};
