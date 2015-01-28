
/**
 * Module dependencies.
 */

var chai = require('chai');
var koa = require('koa');
var paginate = require('../');
var request = require('./request')();
var util = require('util');

chai.should();

/**
 * Test `paginate`.
 */

describe('paginate', function() {
  it('should use the default values', function *() {
    var app = koa();

    app.use(paginate());

    yield request(app.listen())
      .get('/')
      .expect(206)
      .expect('Content-Range', 'bytes 0-49/*')
      .end();
  });

  it('should accept a `maximum` option', function *() {
    var app = koa();

    app.use(paginate({
      maximum: 3
    }));

    yield request(app.listen())
      .get('/')
      .expect(206)
      .expect('Content-Range', 'bytes 0-2/*')
      .end();
  });

  it('should accept a `Range` header', function *() {
    var app = koa();

    app.use(paginate());

    yield request(app.listen())
      .get('/')
      .set('Range', 'items=0-5')
      .expect(206)
      .expect('Content-Range', 'items 0-5/*')
      .end();
  });

  it('should give an error if the `Range` is malformed', function *() {
    var app = koa();

    app.use(paginate());

    yield request(app.listen())
      .get('/')
      .set('Range', 'invalid')
      .expect(412, 'Precondition Failed')
      .end();
  });

  it('should give an error if the `Range` is invalid', function *() {
    var app = koa();

    app.use(paginate());

    yield request(app.listen())
      .get('/')
      .set('Range', 'bytes=5-1')
      .expect(416, 'Range Not Satisfiable')
      .end();
  });

  it('should not allow `limit` value superior to `maximum`', function *() {
    var app = koa();

    app.use(paginate({
      maximum: 3
    }));

    yield request(app.listen())
      .get('/')
      .expect(206)
      .set('Range', 'items=0-5')
      .expect('Content-Range', 'items 0-2/*')
      .end();
  });

  it('should not allow `limit` value superior to `length`', function *() {
    var app = koa();

    app.use(paginate());

    app.use(function *() {
      this.pagination.length = 3;
    });

    yield request(app.listen())
      .get('/')
      .expect(206)
      .set('Range', 'items=0-5')
      .expect('Content-Range', 'items 0-2/3')
      .end();
  });

  it('should set `limit` to `N+1` when `Range` is `items=0-N`', function *() {
    var app = koa();
    var n = 5;

    app.use(paginate());

    app.use(function *() {
      this.pagination.limit.should.equal(n + 1);
    });

    yield request(app.listen())
      .get('/')
      .expect(206)
      .set('Range', util.format('items=0-%s', n))
      .end();
  });

  it('should set `offset` to `N` when `Range` is `items=N-5`', function *() {
    var app = koa();
    var n = 2;

    app.use(paginate());

    app.use(function *() {
      this.pagination.offset.should.equal(n);
    });

    yield request(app.listen())
      .get('/')
      .expect(206)
      .set('Range', util.format('items=%s-5', n))
      .end();
  });
});
