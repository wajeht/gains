import jwt from 'jsonwebtoken';
import { jwt_secret, env } from '../../config/env.js';
import { red } from '../../utils/rainbow-log.js';
import { validationResult } from 'express-validator';
import CustomError from './api.errors.js';

/**
 * It checks if the request has an authorization header, and if it does, it checks if it's a valid JWT
 * token
 * @param req - the request object
 * @param res - the response object
 * @param next - This is a function that you call when you're done with your middleware.
 */
export function auth(req, res, next) {
  try {
    // TODO!: remove this on production
    // ! this code below wil skip any authentication
    if (env === 'development') {
      red('TODO!: Remove auth skipping in production!');
      return next();
    }

    //! -------------------------------- API TOKEN AUTHORIZATION STARTS --------------------------------
    if (Object.keys(req.headers).includes('x-api-key')) {
      red('TODO!: Implement x-api-key authentication');
    }

    //! -------------------------------- BEARER TOKEN AUTHORIZATION STARTS -----------------------------
    const x = req.get('authorization');

    if (!x) throw new CustomError.UnauthorizedError('Must use bearer token authorization!'); // prettier-ignore
    if (x.split(' ').length != 2) throw new CustomError.UnauthorizedError('Must use bearer token authorization!'); // prettier-ignore
    if (!x.startsWith('Bearer')) throw new CustomError.UnauthorizedError('Must use bearer token authorization!'); // prettier-ignore

    const token = x.split(' ')[1];

    try {
      jwt.verify(token, jwt_secret);
    } catch (error) {
      throw new CustomError.UnauthorizedError('Invalid signature!');
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
