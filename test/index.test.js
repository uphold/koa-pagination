'use strict';

/**
 * Module dependencies.
 */

const { middleware } = require('..');
const Koa = require('koa');
const request = require('supertest');

/**
 * Test `paginate`.
 */

describe('middleware', () => {
  let app;
  let server;

  beforeEach(() => {
    app = new Koa();

    app.silent = true;

    server = app.listen();
  });

  afterEach(() => server.close());

  it('should return 206 if no `Range` header is provided', () => {
    app.use(middleware());

    app.use(ctx => {
      ctx.body = '';
    });

    return request(server)
      .get('/')
      .expect(206);
  });

  it('should not return 206 if it is not a successful request', () => {
    app.use(middleware());

    app.use(ctx => {
      ctx.status = 400;
    });

    return request(server)
      .get('/')
      .expect(400);
  });

  it('should use the default values', () => {
    app.use(middleware());

    return request(server)
      .get('/')
      .expect('Content-Range', 'items 0-49/*');
  });

  it('should accept a `maximum` option', () => {
    app.use(middleware({ maximum: 3 }));

    return request(server)
      .get('/')
      .expect('Content-Range', 'items 0-2/*');
  });

  it('should return 500 if `maximum` is not a number', () => {
    app.use(middleware({ maximum: 'invalid' }));

    return request(server)
      .get('/')
      .expect(500);
  });

  it('should return 500 if `maximum` is 0', () => {
    app.use(middleware({ maximum: 0 }));

    return request(server)
      .get('/')
      .expect(500);
  });

  it('should return 500 if `maximum` is lower than 0', () => {
    app.use(middleware({ maximum: -1 }));

    return request(server)
      .get('/')
      .expect(500);
  });

  it('should return 500 if `maximum` is not a safe integer', () => {
    app.use(middleware({ maximum: 9007199254740993 }));

    return request(server)
      .get('/')
      .expect(500);
  });

  it('should accept a `Range` header', () => {
    app.use(middleware());

    return request(server)
      .get('/')
      .set('Range', 'items=0-5')
      .expect('Content-Range', 'items 0-5/*');
  });

  it('should return 412 if the `Range` is malformed', () => {
    app.use(middleware());

    return request(server)
      .get('/')
      .set('Range', 'invalid')
      .expect(412, 'Precondition Failed');
  });

  it('should return 412 if the `Range` unit is not supported', () => {
    app.use(middleware({ unit: 'bytes' }));

    return request(server)
      .get('/')
      .set('Range', 'items=0-*')
      .expect(412);
  });

  it('should return 416 if the `Range` is invalid', () => {
    app.use(middleware());

    return request(server)
      .get('/')
      .set('Range', 'items=5-1')
      .expect(416, 'Range Not Satisfiable');
  });

  it('should return 416 if `first position` value is higher than `length`', () => {
    app.use(middleware());

    app.use(ctx => {
      ctx.pagination.length = 10;
    });

    return request(server)
      .get('/')
      .set('Range', 'items=10-12')
      .expect(416);
  });

  it('should return 416 if `first position` and `last position` have equal values and are equal to `length`', () => {
    app.use(middleware());

    app.use(ctx => {
      ctx.pagination.length = 10;
    });

    return request(server)
      .get('/')
      .set('Range', 'items=10-10')
      .expect(416);
  });

  it('should return 416 if `first position` and `last position` have equal values and are higher than `length`', () => {
    app.use(middleware());

    app.use(ctx => {
      ctx.pagination.length = 10;
    });

    return request(server)
      .get('/')
      .set('Range', 'items=11-11')
      .expect(416);
  });

  it('should return 416 if `first position` is not a safe integer', () => {
    app.use(middleware());

    return request(server)
      .get('/')
      .set('Range', 'items=9007199254740992-9007199254740993')
      .expect(416);
  });

  it('should return 416 if `last position` is not a safe integer', () => {
    app.use(middleware());

    return request(server)
      .get('/')
      .set('Range', 'items=1-9007199254740992')
      .expect(416);
  });

  it('should return 416 if `allowAll` is false and `last position` is `*`', () => {
    app.use(middleware({ allowAll: false }));

    return request(server)
      .get('/')
      .set('Range', 'items=0-*')
      .expect(416);
  });

  it('should return 206 if `last position` is `*`', () => {
    app.use(middleware());

    app.use(ctx => {
      ctx.status = 200;
    });

    return request(server)
      .get('/')
      .set('Range', 'items=0-*')
      .expect(206);
  });

  it('should return the `length` if `last position` is `*`', () => {
    app.use(middleware());

    app.use(ctx => {
      ctx.pagination.length = 20;
    });

    return request(server)
      .get('/')
      .set('Range', 'items=0-*')
      .expect('Content-Range', 'items 0-19/20');
  });

  it('should not allow `last position` value to be higher than `length`', () => {
    app.use(middleware());

    app.use(ctx => {
      ctx.pagination.length = 3;
    });

    return request(server)
      .get('/')
      .expect('Content-Range', 'items 0-2/3');
  });

  it('should not allow `last position` to be equal to `length`', () => {
    app.use(middleware());

    app.use(ctx => {
      ctx.pagination.length = 20;
    });

    return request(server)
      .get('/')
      .set('Range', 'items=0-20')
      .expect('Content-Range', 'items 0-19/20');
  });

  it('should not allow `last position` value to be higher than `maximum`', () => {
    app.use(middleware({ maximum: 3 }));

    return request(server)
      .get('/')
      .expect('Content-Range', 'items 0-2/*');
  });

  it('should use the diference between `last position` and `first position`, plus one, as `limit`', () => {
    const lastPosition = 6;
    const firstPosition = 2;

    app.use(middleware());

    app.use(ctx => {
      expect(ctx.pagination.limit).toEqual(lastPosition - firstPosition + 1);
    });

    return request(server)
      .get('/')
      .set('Range', `items=${firstPosition}-${lastPosition}`);
  });

  it('should use the `first position` as `offset`', () => {
    const firstPosition = 2;

    app.use(middleware());

    app.use(ctx => {
      expect(ctx.pagination.offset).toEqual(firstPosition);
    });

    return request(server)
      .get('/')
      .set('Range', `items=${firstPosition}-5`);
  });

  it('should expose the accepted range unit', () => {
    app.use(middleware({ unit: 'foobar' }));

    return request(server)
      .get('/')
      .expect('Accept-Ranges', 'foobar');
  });

  it('should set the `byte-range-spec` to `*` if length is 0', () => {
    app.use(middleware({ unit: 'bytes' }));

    app.use(ctx => {
      ctx.pagination.length = 0;
    });

    return request(server)
      .get('/')
      .expect('Content-Range', 'bytes */0');
  });
});
