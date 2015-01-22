
/**
 * Module dependencies.
 */

var chai = require('chai');
var koa = require('koa');
var paginate = require('../');
var request = require('./request')();

chai.should();

/**
 * Test `paginate`.
 */

describe('paginate', function() {
  it('should accept a `limit` option', function *() {
    var app = koa();

    app.use(paginate({
      limit: 5
    }));

    yield request(app.listen())
      .get('/')
      .expect('Content-Range', 'items 0-4/*')
      .end();
  });

  it('should accept a `maximum` option', function *() {
    var app = koa();

    app.use(paginate({
      maximum: 3
    }));

    yield request(app.listen())
      .get('/')
      .expect('Content-Range', 'items 0-2/*')
      .end();
  });

  it('should set `Content-Range` headers by default', function *() {
    var app = koa();

    app.use(paginate());

    yield request(app.listen())
      .get('/')
      .expect('Content-Range', 'items 0-19/*')
      .end();
  });

  it('should accept a `Range` header', function *() {
    var app = koa();

    app.use(paginate());

    yield request(app.listen())
      .get('/')
      .set('Range', 'items=0-5')
      .expect('Content-Range', 'items 0-4/*')
      .end();
  });

  it('should allow specifying a `count` variable in the pagination', function *() {
    var app = koa();

    app.use(paginate());

    app.use(function *(next) {
      this.pagination.count = 10;

      yield* next;
    });

    yield request(app.listen())
      .get('/')
      .expect('Content-Range', 'items 0-9/10')
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
      .set('Range', 'items=5-1')
      .expect(412, 'Precondition Failed')
      .end();
  });

  it('should not allow `limit` value superior to `maximum`', function *() {
    var app = koa();

    app.use(paginate({
      limit: 5,
      maximum: 3
    }));

    yield request(app.listen())
      .get('/')
      .expect('Content-Range', 'items 0-2/*')
      .end();
  });
});
