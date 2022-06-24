import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.error.js';

/* It's a custom error class that extends the CustomAPIError class and sets the status code to 401 */
export default class UnauthenticatedError extends CustomAPIError {
  /**
   * The constructor function is a special function that is called when a new object is created
   * @param message - The error message that will be displayed to the user.
   */
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
