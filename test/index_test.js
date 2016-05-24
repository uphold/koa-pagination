
/**
 * Module dependencies.
 */

import Koa from 'koa';
import paginate from '../src';
import request from 'supertest-as-promised';

/**
 * Test `paginate`.
 */

describe('paginate', () => {
  it('should return 200 if no `Range` header is provided', async () => {
    const app = new Koa();

    app.use(paginate());

    app.use(ctx => {
      ctx.body = '';
    });

    await request(app.listen())
      .get('/')
      .expect(200);
  });

  it('should return 206 if a valid `Range` header is provided', async () => {
    const app = new Koa();

    app.use(paginate());

    await request(app.listen())
      .get('/')
      .set('Range', 'items=0-5')
      .expect(206);
  });

  it('should use the default values', async () => {
    const app = new Koa();

    app.use(paginate());

    await request(app.listen())
      .get('/')
      .expect('Content-Range', 'items 0-49/*');
  });

  it('should accept a `maximum` option', async () => {
    const app = new Koa();

    app.use(paginate({ maximum: 3 }));

    await request(app.listen())
      .get('/')
      .expect('Content-Range', 'items 0-2/*');
  });

  it('should return 500 if `maximum` is not a number', async () => {
    const app = new Koa();

    app.use(paginate({ maximum: 'invalid' }));

    await request(app.listen())
      .get('/')
      .expect(500);
  });

  it('should return 500 if `maximum` is 0', async () => {
    const app = new Koa();

    app.use(paginate({ maximum: 0 }));

    await request(app.listen())
      .get('/')
      .expect(500);
  });

  it('should return 500 if `maximum` is lower than 0', async () => {
    const app = new Koa();

    app.use(paginate({ maximum: -1 }));

    await request(app.listen())
      .get('/')
      .expect(500);
  });

  it('should return 500 if `maximum` is not a safe integer', async () => {
    const app = new Koa();

    app.use(paginate({ maximum: 9007199254740993 }));

    await request(app.listen())
      .get('/')
      .expect(500);
  });

  it('should accept a `Range` header', async () => {
    const app = new Koa();

    app.use(paginate());

    await request(app.listen())
      .get('/')
      .set('Range', 'items=0-5')
      .expect('Content-Range', 'items 0-5/*');
  });

  it('should return 412 if the `Range` is malformed', async () => {
    const app = new Koa();

    app.use(paginate());

    await request(app.listen())
      .get('/')
      .set('Range', 'invalid')
      .expect(412, 'Precondition Failed');
  });

  it('should return 416 if the `Range` is invalid', async () => {
    const app = new Koa();

    app.use(paginate());

    await request(app.listen())
      .get('/')
      .set('Range', 'items=5-1')
      .expect(416, 'Range Not Satisfiable');
  });

  it('should return 416 if `first position` value is higher than `length`', async () => {
    const app = new Koa();

    app.use(paginate());

    app.use(ctx => {
      ctx.pagination.length = 10;
    });

    await request(app.listen())
      .get('/')
      .set('Range', 'items=10-12')
      .expect(416);
  });

  it('should return 416 if `first position` and `last position` have equal values and are equal to `length`', async () => {
    const app = new Koa();

    app.use(paginate());

    app.use(ctx => {
      ctx.pagination.length = 10;
    });

    await request(app.listen())
      .get('/')
      .set('Range', 'items=10-10')
      .expect(416);
  });

  it('should return 416 if `first position` and `last position` have equal values and are higher than `length`', async () => {
    const app = new Koa();

    app.use(paginate());

    app.use(ctx => {
      ctx.pagination.length = 10;
    });

    await request(app.listen())
      .get('/')
      .set('Range', 'items=11-11')
      .expect(416);
  });

  it('should return 416 if `first position` is not a safe integer', async () => {
    const app = new Koa();

    app.use(paginate());

    await request(app.listen())
      .get('/')
      .set('Range', 'items=9007199254740992-9007199254740993')
      .expect(416);
  });

  it('should return 416 if `last position` is not a safe integer', async () => {
    const app = new Koa();

    app.use(paginate());

    await request(app.listen())
      .get('/')
      .set('Range', 'items=1-9007199254740992')
      .expect(416);
  });

  it('should return 416 if `allowAll` is false and `last position` is `*`', async () => {
    const app = new Koa();

    app.use(paginate({ allowAll: false }));

    await request(app.listen())
      .get('/')
      .set('Range', 'items=0-*')
      .expect(416);
  });

  it('should return 206 if `last position` is `*`', async () => {
    const app = new Koa();

    app.use(paginate());

    await request(app.listen())
      .get('/')
      .set('Range', 'items=0-*')
      .expect(206);
  });

  it('should return the `length` if `last position` is `*`', async () => {
    const app = new Koa();

    app.use(paginate());

    app.use(ctx => {
      ctx.pagination.length = 20;
    });

    await request(app.listen())
      .get('/')
      .set('Range', 'items=0-*')
      .expect('Content-Range', 'items 0-19/20');
  });

  it('should not allow `last position` value to be higher than `length`', async () => {
    const app = new Koa();

    app.use(paginate());

    app.use(ctx => {
      ctx.pagination.length = 3;
    });

    await request(app.listen())
      .get('/')
      .set('Range', 'items=0-5')
      .expect('Content-Range', 'items 0-2/3');
  });

  it('should not allow `last position` to be equal to `length`', async () => {
    const app = new Koa();

    app.use(paginate());

    app.use(ctx => {
      ctx.pagination.length = 20;
    });

    await request(app.listen())
      .get('/')
      .set('Range', 'items=0-20')
      .expect('Content-Range', 'items 0-19/20');
  });

  it('should not allow `last position` value to be higher than `maximum`', async () => {
    const app = new Koa();

    app.use(paginate({ maximum: 3 }));

    await request(app.listen())
      .get('/')
      .set('Range', 'items=0-5')
      .expect('Content-Range', 'items 0-2/*');
  });

  it('should use the diference between `last position` and `first position`, plus one, as `limit`', async () => {
    const app = new Koa();

    const lastPosition = 6;
    const firstPosition = 2;

    app.use(paginate());

    app.use(ctx => {
      ctx.pagination.limit.should.equal(lastPosition - firstPosition + 1);
    });

    await request(app.listen())
      .get('/')
      .set('Range', `items=${firstPosition}-${lastPosition}`);
  });

  it('should use the `first position` as `offset`', async () => {
    const app = new Koa();
    const firstPosition = 2;

    app.use(paginate());

    app.use(ctx => {
      ctx.pagination.offset.should.equal(firstPosition);
    });

    await request(app.listen())
      .get('/')
      .set('Range', `items=${firstPosition}-5`);
  });

  it('should expose the given `range-unit`', async () => {
    const app = new Koa();

    app.use(paginate({ unit: 'bytes' }));

    app.use(ctx => {
      ctx.pagination.unit.should.equal('foobar');
    });

    await request(app.listen())
      .get('/')
      .set('Range', 'foobar=0-5')
      .expect('Content-Range', 'foobar 0-5/*');
  });

  it('should set the `byte-range-spec` to `*` if length is 0', async () => {
    const app = new Koa();

    app.use(paginate({ unit: 'bytes' }));

    app.use(ctx => {
      ctx.pagination.length = 0;
    });

    await request(app.listen())
      .get('/')
      .expect('Content-Range', 'bytes */0');
  });
});
