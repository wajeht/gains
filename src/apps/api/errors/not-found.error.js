import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.error.js';

/* It's a custom error class that extends the built-in Error class and sets the statusCode property to 404 */
export default class NotFoundError extends CustomAPIError {
  /**
   * The constructor function is a special function that is called when a new object is created
   * @param message - The error message.
   */
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
