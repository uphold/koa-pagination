# koa-pagination

`koa-pagination` is a middleware to handle [Range Pagination Headers](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html) using `Range` & `Content-Range` entity-headers.

## Status

[![npm version][npm-image]][npm-url] [![build status][travis-image]][travis-url]

## Installation

Install the package via `yarn`:

```sh
❯ yarn add koa-pagination
```

or via `npm`:

```sh
❯ npm install koa-pagination --save
```

### Configuration

The middleware can be configured with the following parameters:

- `allowAll`: Whether to accept `*` as range-specifier.
- `maximum`: Maximum number of items allowed per page (`50` by default).
- `unit`: Accepted range unit (`items` by default).

You can change the defaults by doing:

```javascript
middleware({
  allowAll: true,
  maximum: 100,
  unit: 'bytes'
});
```

## Usage

```javascript
const { middleware } = require('koa-pagination');
const Koa = require('koa');

const app = new Koa();

app.get('/', middleware(), async ctx => {
  // `paginate` middleware will inject a `pagination` object in the `koa` context,
  // which will allow you to use the `pagination.offset` and `pagination.limit`
  // in your data retrieval methods.
  ctx.body = await foobar.getData({
    limit: ctx.pagination.limit,
    offset: ctx.pagination.offset
  });

  // This is needed in order to expose the length in `Content-Range` header.
  ctx.pagination.length = foobar.count();
});

app.listen(3000);
```

### Request

You can provide the `Range` header specifying the items you want to retrieve. For instance to retrieve the first 5 elements:

```javascript
'Range: items=0-4'
```

You can also provide `*` at the end of the range in order to retrieve the all of the available items:

```javascript
'Range: items=0-*'
```

### Response

The first example will generate a response with the following headers:

```javascript
'Accepted-Ranges': 'items'
'Content-Range: items 0-4/*'
```

The `*` in the `Content-Range` header will be replaced with the total number of items provided in the `length` variable.

#### Codes

Code | Reason
---- | -------------------------------------------------------------------------
200  | `Range` header has not been provided.
206  | `Range` header is valid.
412  | `Range` header is malformed.
416  | `Range` header is invalid.
500  | Incorrect middleware configuration or unexpected value inside middleware.

## Tests

```sh
❯ yarn test
```

## Release

```sh
❯ npm version [<new version> | major | minor | patch] -m "Release %s"
```

[npm-image]: https://img.shields.io/npm/v/koa-pagination.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-pagination
[travis-image]: https://img.shields.io/travis/uphold/koa-pagination.svg?style=flat-square
[travis-url]: https://travis-ci.org/uphold/koa-pagination
