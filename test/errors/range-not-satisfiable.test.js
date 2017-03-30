'use strict';

/**
 * Module dependencies.
 */

const { RangeNotSatisfiableError } = require('../..').errors;
const StandardHttpError = require('standard-http-error');

/**
 * Test `RangeNotSatisfiableError`.
 */

describe('RangeNotSatisfiableError', () => {
  it('should inherit from `StandardHttpError`', () => {
    const error = new RangeNotSatisfiableError();

    expect(error).toBeInstanceOf(StandardHttpError);
  });

  it('should have a default `code`', () => {
    const error = new RangeNotSatisfiableError();

    expect(error.code).toEqual(416);
  });

  it('should have a default message', () => {
    const error = new RangeNotSatisfiableError();

    expect(error.message).toEqual('Range Not Satisfiable');
  });
});
