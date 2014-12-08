
/**
 * Module dependencies.
 */

var koa = require('koa');
var koaPaginate = require('../');
var request = require('./request')();
var chai = require('chai');

chai.should();

/**
 * Test `KoaPaginate`.
 */

describe('KoaPaginate', function() {
  it('should not set `Content-Range` header if no `Range` header is set', function *() {
    var app = koa();

    app.use(koaPaginate());

    app.use(function *(next) {
      this.body = '';

      yield* next;
    });

    yield request(app.listen())
      .get('/')
      .expect(200)
      .expect(function(res) {
        (undefined === res.get('Content-Range')).should.be.true;
        (undefined === res.get('Range-Unit')).should.be.true;
      })
      .end();
  });

  it('should not set `Content-Range` header if `Range` header is set but `count` is not defined', function *() {
    var app = koa();

    app.use(koaPaginate());

    app.use(function *(next) {
      this.body = '';

      yield* next;
    });

    yield request(app.listen())
      .get('/')
      .set('Range', '1 - 5')
      .expect(200)
      .expect(function(res) {
        (undefined === res.get('Content-Range')).should.be.true;
        (undefined === res.get('Range-Unit')).should.be.true;
      })
      .end();
  });

  it('should give an error if the range has only one value', function *() {
    var app = koa();

    app.use(koaPaginate());

    app.use(function *(next) {
      this.body = '';

      yield* next;
    });

    yield request(app.listen())
      .get('/')
      .set('Range', '1')
      .expect(400)
      .expect('Range header should have the following configuration: `from-to`.')
      .end();
  });

  it('should give an error if the range is not numeric', function *() {
    var app = koa();

    app.use(koaPaginate());

    app.use(function *(next) {
      this.body = '';

      yield* next;
    });

    yield request(app.listen())
      .get('/')
      .set('Range', 'foo-bar')
      .expect(400)
      .expect('Range header values must be valid numbers.')
      .end();
  });

  it('should give an error if the range required more than 50 items', function *() {
    var app = koa();

    app.use(koaPaginate());

    app.use(function *(next) {
      this.body = '';

      yield* next;
    });

    yield request(app.listen())
      .get('/')
      .set('Range', '1-51')
      .expect(400)
      .expect('Can\'t request more than 50 items.')
      .end();
  });

  it('should give an error if an invalid range is provided', function *() {
    var app = koa();

    app.use(koaPaginate());

    app.use(function *(next) {
      this.body = '';

      yield* next;
    });

    yield request(app.listen())
      .get('/')
      .set('Range', 'foobar')
      .expect(400)
      .expect('Range header should have the following configuration: `from-to`.')
      .end();
  });

  it('should set `Content-Range` header if `Range` header and `count` values are set', function *() {
    var app = koa();

    app.use(koaPaginate());

    app.use(function *(next) {
      this.body = '';
      this.count = 10;

      this.pagination.offset.should.equal(0);
      this.pagination.limit.should.equal(5);

      yield* next;
    });

    yield request(app.listen())
      .get('/')
      .set('Range', '0 - 4')
      .expect(200)
      .expect(function(res) {
        (undefined === res.get('Content-Range')).should.be.false;
        res.get('Content-Range').should.equal('0-4/10');
      })
      .end();
  });

  it('should set default `Content-Range` header if `Range` header and `count` values are set and `count` equals 0', function *() {
    var app = koa();

    app.use(koaPaginate());

    app.use(function *(next) {
      this.body = '';
      this.count = 0;

      yield* next;
    });

    yield request(app.listen())
      .get('/')
      .set('Range', '0 - 4')
      .expect(200)
      .expect(function(res) {
        (undefined === res.get('Content-Range')).should.be.false;
        res.get('Content-Range').should.equal('*/0');
      })
      .end();
  });

  it('should set `Access-Control-Expose-Headers` header with `Accept-Ranges`, `Content-Range` and `Range-Unit`.', function *() {
    var app = koa();

    app.use(koaPaginate());

    app.use(function *(next) {
      this.body = '';
      this.count = 0;

      yield* next;
    });

    yield request(app.listen())
      .get('/')
      .set('Range', '0 - 4')
      .expect(200)
      .expect(function(res) {
        res.get('Access-Control-Expose-Headers').indexOf('Accept-Ranges').should.be.above(-1);
        res.get('Access-Control-Expose-Headers').indexOf('Content-Range').should.be.above(-1);
        res.get('Access-Control-Expose-Headers').indexOf('Range-Unit').should.be.above(-1);
      })
      .end();
  });
});
