
/**
 * Module dependencies.
 */

import HttpError from 'standard-http-error';

/**
 * Constructor.
 */

export default class MalformedRangeError extends HttpError {
  constructor() {
    super(412, { message: 'Malformed Range Error' });
  }
}
