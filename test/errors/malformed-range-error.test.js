'use strict';

/**
 * Module dependencies.
 */

const MalformedRangeError = require('../../errors/malformed-range-error');
const StandardHttpError = require('standard-http-error');

/**
 * Test `MalformedRangeError`.
 */

describe('MalformedRangeError', () => {
  it('should inherit from `StandardHttpError`', () => {
    const error = new MalformedRangeError();

    expect(error).toBeInstanceOf(StandardHttpError);
  });

  it('should have a default `code`', () => {
    const error = new MalformedRangeError();

    expect(error.code).toEqual(412);
  });

  it('should have a default message', () => {
    const error = new MalformedRangeError();

    expect(error.message).toEqual('Malformed Range Error');
  });
});
