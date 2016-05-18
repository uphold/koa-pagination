
/**
 * Module dependencies.
 */

import HttpError from 'standard-http-error';

/**
 * Constructor.
 */

export default class RangeNotSatisfiableError extends HttpError {
  constructor() {
    super(416);
  }
}
