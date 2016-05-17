
/**
 * Module dependencies.
 */

import RangeNotSatisfiableError from '../../src/errors/range-not-satisfiable-error';
import StandardHttpError from 'standard-http-error';

/**
 * Test `RangeNotSatisfiableError`.
 */

describe('RangeNotSatisfiableError', () => {
  it('should inherit from `StandardHttpError`', () => {
    const error = new RangeNotSatisfiableError();

    error.should.be.instanceOf(StandardHttpError);
  });

  it('should have a default `code`', () => {
    const error = new RangeNotSatisfiableError();

    error.code.should.equal(416);
  });

  it('should have a default message', () => {
    const error = new RangeNotSatisfiableError();

    error.message.should.equal('Range Not Satisfiable');
  });
});
