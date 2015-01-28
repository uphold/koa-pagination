# Koa Pagination
[![Build Status](https://travis-ci.org/seegno/koa-pagination.svg?branch=master)](https://travis-ci.org/seegno/koa-pagination)

Koa Pagination is a middleware to handle [Range Pagination Headers](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html) using `Range` & `Content-Range` entity-headers.

## Installation

Choose your preferred method:

* npm: `npm install --save koa-pagination`
* Download: [koa-pagination](https://github.com/seegno/koa-pagination)

### Configuration

The middleware can be configured with the following parameters:
- Maximum: Maximum number of items allowed per page (50 items by default).

You can change the defaults by doing:

```js
paginate({
  maximum: 100
});
```
## Usage

```js
var koa = require('koa');
var paginate = require('koa-pagination');

var app = koa();

app.get('/', paginate(), function *() {
  // `paginate` middleware will inject a `pagination` object in the `koa` context,
  // which will allow you to use the `pagination.offset` and `pagination.limit`
  // in your data retrieval methods.
  this.body = foobar.getData({
    limit: this.pagination.limit,
    offset: this.pagination.offset
  });

  // This is needed in order to expose the length in `Content-Range` header.
  this.pagination.length = foobar.count();
});

app.listen(3000);
```


### Request

You can provide the `Range` header specifying the items you want to retrieve. For instance to retrieve the first 5 elements:

```js
'Range: items=0-5'
```

### Response

This will generate a response with the following `Content-Range` header:

```js
'Content-Range: items 0-4/*'
```

The `*` will be replaced with the total number of items provided in the `length` variable.

## Running tests

```sh
npm test
```
