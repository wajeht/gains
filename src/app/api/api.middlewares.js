import jwt from 'jsonwebtoken';
import { jwt_secret } from '../../config/env.js';
import { validationResult } from 'express-validator';
import CustomError from './api.errors.js';

export function authenticateUser(req, res, next, ui = false) {
  try {
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
    if (ui) {
      return res.redirect('/dashboard/login');
    } else {
      next(error);
    }
  }
}

export const catchAsyncErrors = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

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
