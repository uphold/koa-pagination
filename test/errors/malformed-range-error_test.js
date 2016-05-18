
/**
 * Module dependencies.
 */

import MalformedRangeError from '../../src/errors/malformed-range-error';
import StandardHttpError from 'standard-http-error';

/**
 * Test `MalformedRangeError`.
 */

describe('MalformedRangeError', () => {
  it('should inherit from `StandardHttpError`', () => {
    const error = new MalformedRangeError();

    error.should.be.instanceOf(StandardHttpError);
  });

  it('should have a default `code`', () => {
    const error = new MalformedRangeError();

    error.code.should.equal(412);
  });

  it('should have a default message', () => {
    const error = new MalformedRangeError();

    error.message.should.equal('Malformed Range Error');
  });
});
