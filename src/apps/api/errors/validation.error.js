import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.error.js';

export default class ValidationError extends CustomAPIError {
  /**
   * The constructor function is a special function that is called when a new object is created
   * @param message - The message that will be displayed to the user.
   */
  constructor(message, errors) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.errors = errors;
  }
}
