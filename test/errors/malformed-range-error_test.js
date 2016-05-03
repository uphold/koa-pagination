
/**
 * Module dependencies.
 */

var MalformedRangeError = require('../../errors/malformed-range-error');
var StandardHttpError = require('standard-http-error');

/**
 * Test `MalformedRangeError`.
 */

describe('MalformedRangeError', function() {
  it('should inherit from `StandardHttpError`', function() {
    const error = new MalformedRangeError();

    error.should.be.instanceOf(StandardHttpError);
  });

  it('should have a default `code`', function() {
    const error = new MalformedRangeError();

    error.code.should.equal(412);
  });

  it('should have a default message', function() {
    const error = new MalformedRangeError();

    error.message.should.equal('Precondition Failed');
  });
});
