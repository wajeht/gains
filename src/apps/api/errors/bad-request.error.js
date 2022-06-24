import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.error.js';

export default class BadRequestError extends CustomAPIError {
  /**
   * A constructor function that takes in a message and sets the statusCode to 400.
   * @param message - The error message that will be displayed to the user.
   */
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
