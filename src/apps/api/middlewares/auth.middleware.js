import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { jwt_secret } from '../../../config/env.js';
import { env } from '../../../config/env.js';
import { red } from '../../../utils/rainbow-log.js';

import CustomError from '../errors/custom-error.error.js';

/**
 * It checks if the request has an authorization header, and if it does, it checks if it's a valid JWT
 * token
 * @param req - the request object
 * @param res - the response object
 * @param next - This is a function that you call when you're done with your middleware.
 */
export default function auth(req, res, next) {
  try {
    // // TODO!: remove this on production
    // if (env === 'development') {
    //   red('TODO!: remove auth skipping in production!');
    //   return next();
    // }

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
