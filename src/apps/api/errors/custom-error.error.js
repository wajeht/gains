import BadRequestError from './bad-request.error.js';
import CustomAPIError from './custom-api.error.js';
import NotFoundError from './not-found.error.js';
import UnauthenticatedError from './unauthenticated.error.js';
import UnauthorizedError from './unauthorized.error.js';
import ValidationError from './validation.error.js';

/* Exporting the object `CustomError` with the properties `BadRequestError`, `CustomAPIError`, `NotFoundError`, `UnauthenticatedError`, and `UnauthorizedError`. */
const CustomError = {
  BadRequestError,
  CustomAPIError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
  ValidationError,
};

export default CustomError;
