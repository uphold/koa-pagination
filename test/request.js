
/**
 * Module dependencies.
 */

var Test = require('co-supertest').Test;
var http = require('http');
var join = require('path').join;
var methods =  require('methods');

/**
 * Export `Request`.
 */

module.exports = function(prefix) {
  return function(app) {
    if ('function' === typeof app) {
      app = http.createServer(app);
    }

    var obj = {};

    methods.forEach(function(method) {
      obj[method] = function(url) {
        return new Test(app, method, join(prefix || '/', url));
      };
    });

    // Support previous use of del
    obj.del = obj['delete'];

    return obj;
  };
};
