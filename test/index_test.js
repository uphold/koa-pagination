
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
  it('should return 200 if no `Range` header is provided', function *() {
    var app = koa();

    app.use(paginate());

    app.use(function *() {
      this.body = '';
    });

    yield request(app.listen())
      .get('/')
      .expect(200)
      .end();
  });

  it('should return 206 if a valid `Range` header is provided', function *() {
    var app = koa();

    app.use(paginate());

    yield request(app.listen())
      .get('/')
      .set('Range', 'items=0-5')
      .expect(206)
      .end();
  });

  it('should use the default values', function *() {
    var app = koa();

    app.use(paginate());

    yield request(app.listen())
      .get('/')
      .expect('Content-Range', 'bytes 0-49/*')
      .end();
  });

  it('should accept a `maximum` option', function *() {
    var app = koa();

    app.use(paginate({ maximum: 3 }));

    yield request(app.listen())
      .get('/')
      .expect('Content-Range', 'bytes 0-2/*')
      .end();
  });

  it('should give and error if `maximum` is not a number', function *() {
    var app = koa();

    app.use(paginate({ maximum: 'invalid' }));

    yield request(app.listen())
      .get('/')
      .expect(500)
      .end();
  });

  it('should give and error if `maximum` is 0', function *() {
    var app = koa();

    app.use(paginate({ maximum: 0 }));

    yield request(app.listen())
      .get('/')
      .expect(500)
      .end();
  });

  it('should give and error if `maximum` is lower than 0', function *() {
    var app = koa();

    app.use(paginate({ maximum: -1 }));

    yield request(app.listen())
      .get('/')
      .expect(500)
      .end();
  });

  it('should accept a `Range` header', function *() {
    var app = koa();

    app.use(paginate());

    yield request(app.listen())
      .get('/')
      .set('Range', 'items=0-5')
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

  it('should give and error if `first position` value is higher than `length`', function *() {
    var app = koa();

    app.use(paginate());

    app.use(function *() {
      this.pagination.length = 10;
    });

    yield request(app.listen())
      .get('/')
      .set('Range', 'items=10-12')
      .expect(416)
      .end();
  });

  it('should give and error if `first position` and `last position` have equal values and are equal to `length`', function *() {
    var app = koa();

    app.use(paginate());

    app.use(function *() {
      this.pagination.length = 10;
    });

    yield request(app.listen())
      .get('/')
      .set('Range', 'items=10-10')
      .expect(416)
      .end();
  });

  it('should give and error if `first position` and `last position` have equal values and are higher than `length`', function *() {
    var app = koa();

    app.use(paginate());

    app.use(function *() {
      this.pagination.length = 10;
    });

    yield request(app.listen())
      .get('/')
      .set('Range', 'items=11-11')
      .expect(416)
      .end();
  });

  it('should not allow `last position` value to be higher than `length`', function *() {
    var app = koa();

    app.use(paginate());

    app.use(function *() {
      this.pagination.length = 3;
    });

    yield request(app.listen())
      .get('/')
      .set('Range', 'items=0-5')
      .expect('Content-Range', 'items 0-2/3')
      .end();
  });

  it('should not allow `last position` to be equal to `length`', function *() {
    var app = koa();

    app.use(paginate());

    app.use(function *() {
      this.pagination.length = 20;
    });

    yield request(app.listen())
      .get('/')
      .set('Range', 'items=0-20')
      .expect('Content-Range', 'items 0-19/20')
      .end();
  });

  it('should not allow `last position` value to be higher than `maximum`', function *() {
    var app = koa();

    app.use(paginate({ maximum: 3 }));

    yield request(app.listen())
      .get('/')
      .set('Range', 'items=0-5')
      .expect('Content-Range', 'items 0-2/*')
      .end();
  });

  it('should use the diference between `last position` and `first position`, plus one, as `limit`', function *() {
    var app = koa();

    var lastPosition = 6;
    var firstPosition = 2;

    app.use(paginate());

    app.use(function *() {
      this.pagination.limit.should.equal(lastPosition - firstPosition + 1);
    });

    yield request(app.listen())
      .get('/')
      .set('Range', util.format('items=%s-%s', firstPosition, lastPosition))
      .end();
  });

  it('should use the `first position` as `offset`', function *() {
    var app = koa();
    var firstPosition = 2;

    app.use(paginate());

    app.use(function *() {
      this.pagination.offset.should.equal(firstPosition);
    });

    yield request(app.listen())
      .get('/')
      .set('Range', util.format('items=%s-5', firstPosition))
      .end();
  });

  it('should set the `byte-range-spec` to `*` if length is 0', function *() {
    var app = koa();

    app.use(paginate());

    app.use(function *() {
      this.pagination.length = 0;
    });

    yield request(app.listen())
      .get('/')
      .expect('Content-Range', 'bytes */0')
      .end();
  });
});
