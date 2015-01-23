# Koa Pagination

Koa Pagination is a middleware to handle [Range Pagination Headers](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html) using `Range` & `Content-Range` entity-headers.

[![Build Status](https://travis-ci.org/seegno/koa-pagination.svg?branch=master)](https://travis-ci.org/seegno/koa-pagination)

## Installation

Choose your preferred method:

* npm: `npm install --save koa-pagination`
* Download: [koa-pagination](https://github.com/seegno/koa-pagination)

### Configuration

The middleware can be configured with the following parameters:
- Limit: Default number of items per page (20 items by default).
- Maximum: Maximum number of items allowed per page (50 items by default).

You can change the defaults by doing:

```js
paginate({
  limit: 10,
  maximum: 100
});
```

**Note** the default limit value is used only in the absence of the `Range` header.

## Usage

```js
var koa = require('koa');
var paginate = require('koa-pagination');

var app = koa();

app.get('/', paginate(), function *() {
  var options = {
    limit: this.pagination.limit,
    offset: this.pagination.offset
  };

  // `paginate` middleware will inject a `pagination` object in the `koa` context,
  // which will allow you to use the `pagination.offset` and `pagination.limit`
  // in your data retrieval methods.
  this.body = Foobar.getData(options);

  // This is needed in order to expose the count in `Content-Range` header.
  this.pagination.count = Foobar.count(options);
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

The `*` will be replaced with the total number of items provided in the `pagination.count` variable.

## Running tests

```sh
npm test
```
