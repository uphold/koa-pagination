
/**
 * Module dependencies.
 */

import { Test } from 'co-supertest';
import { createServer, METHODS as methods } from 'http';

/**
 * Export `Request`.
 */

export default app => {
  if (typeof app === 'function') {
    app = createServer(app);
  }

  const obj = {};

  // Monkey-patch all http methods (GET, PATCH, POST, etc.).
  methods
    .map(method => method.toLowerCase())
    .forEach(method => {
      obj[method] = url => new Test(app, method, url);
    });

  // Support previous use of del.
  obj.del = obj['delete'];

  return obj;
};
