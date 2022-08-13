import jwt from 'jsonwebtoken';
import { jwt_secret, env } from '../../config/env.js';
import { red } from '../../utils/rainbow-log.js';
import { validationResult } from 'express-validator';
import CustomError from './api.errors.js';

import path from 'path';

/**
 * It checks if the request has an authorization header, and if it does, it checks if it's a valid JWT
 * token
 * @param req - the request object
 * @param res - the response object
 * @param next - This is a function that you call when you're done with your middleware.
 */
export function authenticateUser(req, res, next) {
  try {
    // if (env === 'development') {
    //   red('TODO!: Remove auth skipping in production!');
    //   return next();
    // }

    let token = null;

    //! -------------------------------- JWT COOKIE TOKEN AUTHENTICATION STARTS -------------------------
    if (req.signedCookies['token']) {
      token = req.signedCookies['token'];
    }
    //! -------------------------------- BEARER TOKEN AUTHENTICATION STARTS -----------------------------
    else if (req.headers.authorization) {
      if (req.headers.authorization.split(' ').length != 2) throw new CustomError.UnauthorizedError('Must use bearer token authentication!'); // prettier-ignore
      if (!req.headers.authorization.startsWith('Bearer')) throw new CustomError.UnauthorizedError('Must use bearer token authentication!'); // prettier-ignore
      token = req.headers.authorization.split(' ')[1];
    }
    //! -------------------------------- API TOKEN AUTHENTICATION STARTS --------------------------------
    else if (req.headers['x-api-key']) {
      token = req.headers['x-api-key'];
      // TODO: implement api key auth here
    } else {
      throw new CustomError.UnauthorizedError('Invalid authentication!');
    }

    try {
      const verified = jwt.verify(token, jwt_secret);

      // attach to request response
      req.user = {
        user_id: verified.user_id,
        role: verified.role,
      };
    } catch (error) {
      throw new CustomError.UnauthenticatedError('Invalid signature!');
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * It takes a function as an argument, and returns a new function that wraps the original function in a try/catch block
 * @param fn - The function that we want to wrap in a try/catch block.
 * @returns A function that takes in a function as an argument and returns a function that takes in
 * req, res, and next as arguments.
 */
export const catchAsyncErrors = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

/**
 * It takes in a list of roles and returns a function that takes in a request, response and next
 * object. It then checks if the user's role is included in the list of roles passed in. If it is, it
 * calls next() to continue the request. If it isn't, it throws an error
 * @param roles - An array of roles that are allowed to access the route.
 * @returns A function that takes in 3 parameters.
 */
export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        throw new CustomError.UnauthorizedError('Unauthorized to access this route');
      }
      next();
    } catch (e) {
      next(e);
    }
  };
};

/**
 * It takes an array of validations, runs them, and if any of them fail, it returns a 400 response with
 * the errors
 * @param validations - An array of validation objects.
 * @returns A function that takes in an array of validations and returns a function that takes in a
 * request, response, and next.
 */
// export const validator = (validations) => {
//   return async (req, res, next) => {
//     for (let validation of validations) {
//       const result = await validation.run(req);
//       if (result.errors.length) break;
//     }
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//       return next();
//     }

//     res.status(400).json({ errors: errors.array() });
//   };
// };

/**
 * It takes an array of schemas, runs them against the request, and if there are no errors, it calls
 * the next middleware. If there are errors, it throws a ValidationError
 * @param schemas - An array of schemas to validate.
 * @returns A function that takes in schemas, req, res, and next.
 */
export const validator = (schemas) => {
  return async (req, res, next) => {
    try {
      await Promise.all(schemas.map((schema) => schema.run(req)));
      const result = validationResult(req);
      if (result.isEmpty()) return next();
      const { errors } = result;
      throw new CustomError.ValidationError('Validation errors within your requests!', errors);
    } catch (err) {
      next(err);
    }
  };
};
