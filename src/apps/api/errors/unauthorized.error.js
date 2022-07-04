import { StatusCodes } from 'http-status-codes';
import { yellow } from '../../../utils/rainbow-log.js';
import CustomAPIError from './custom-api.error.js';

/* It's a custom error class that extends the CustomAPIError class and sets the status code to 403 */
export default class UnauthorizedError extends CustomAPIError {
  /**
   * The constructor function is a special function that is called when a new object is created
   * @param message - The message that will be displayed to the user.
   */
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
