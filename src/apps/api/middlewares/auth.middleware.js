import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { jwt_secret } from '../../../config/env.js';

/**
 * It checks if the request has an authorization header, and if it does, it checks if it's a valid JWT
 * token
 * @param req - the request object
 * @param res - the response object
 * @param next - This is a function that you call when you're done with your middleware.
 */
export default function auth(req, res, next) {
  try {
    const x = req.get('authorization');

    if (!x) throw new Error('must use bearer token authorization!');
    if (x.split(' ').length != 2) throw new Error('must use bearer token authorization!');
    if (!x.startsWith('Bearer')) throw new Error('must use bearer token authorization!');

    const token = x.split(' ')[1];

    try {
      jwt.verify(token, jwt_secret);
    } catch (error) {
      throw new Error('Invalid signature!');
    }
    next();
  } catch (error) {
    next(error);
  }
}
