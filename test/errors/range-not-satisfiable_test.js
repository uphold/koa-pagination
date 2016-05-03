
/**
 * Module dependencies.
 */

var RangeNotSatisfiableError = require('../../errors/range-not-satisfiable-error');
var StandardHttpError = require('standard-http-error');

/**
 * Test `RangeNotSatisfiableError`.
 */

describe('RangeNotSatisfiableError', function() {
  it('should inherit from `StandardHttpError`', function() {
    const error = new RangeNotSatisfiableError();

    error.should.be.instanceOf(StandardHttpError);
  });

  it('should have a default `code`', function() {
    const error = new RangeNotSatisfiableError();

    error.code.should.equal(416);
  });

  it('should have a default message', function() {
    const error = new RangeNotSatisfiableError();

    error.message.should.equal('Range Not Satisfiable');
  });
});
