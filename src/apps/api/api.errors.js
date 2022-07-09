import { StatusCodes } from 'http-status-codes';

/* CustomAPIError is a class that extends the Error class and has a constructor that takes a message
parameter and sets the name property to 'CustomAPIError'. */
class CustomAPIError extends Error {
  /**
   * The constructor function is a special function that is called when a new object is created
   * @param message - The error message.
   */
  constructor(message) {
    super(message);
    this.name = 'CustomAPIError';
  }
}

/* It's a custom error class that extends the CustomAPIError class and sets the statusCode to 400 */
class BadRequestError extends CustomAPIError {
  /**
   * A constructor function that takes a message as an argument. It sets the statusCode to 400.
   * @param message - The error message that will be displayed to the user.
   */
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

/* `NotFoundError` is a custom error class that extends `CustomAPIError` and sets the `statusCode`
property to `StatusCodes.NOT_FOUND` */
class NotFoundError extends CustomAPIError {
  /**
   * The constructor function is a special function that is called when a new object is created
   * @param message - The error message.
   */
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

/* `UnauthenticatedError` is a custom error class that extends `CustomAPIError` and is used to throw
errors when a user is not authenticated */
class UnauthenticatedError extends CustomAPIError {
  /**
   * The constructor function is a special function that is called when a new object is created
   * @param message - The error message that will be displayed to the user.
   */
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

/* `UnauthorizedError` is a custom error class that extends `CustomAPIError` and sets the `statusCode`
property to `403` */
class UnauthorizedError extends CustomAPIError {
  /**
   * The constructor function is a special function that is called when a new object is created
   * @param message - The message that will be displayed to the user.
   */
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

/* It's a custom error class that extends the CustomAPIError class and adds a statusCode and errors
property */
class ValidationError extends CustomAPIError {
  /**
   * The constructor function is a special function that is called when a new object is created
   * @param message - The error message that will be displayed to the user.
   * @param errors - An array of error objects. Each error object should have a message and a field
   * property.
   */
  constructor(message, errors) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.errors = errors;
  }
}

const CustomError = {
  BadRequestError,
  CustomAPIError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
  ValidationError,
};

export default CustomError;
