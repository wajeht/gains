import { validationResult } from 'express-validator';
import ValidationError from '../errors/validation.error.js';

/* eslint-disable */
const validate = (schemas) => {
  return async (req, res, next) => {
    try {
      await Promise.all(schemas.map((schema) => schema.run(req)));

      const result = validationResult(req);

      if (result.isEmpty()) {
        return next();
      }

      const { errors } = result;

      throw new ValidationError('Validatoin errors within your requests!', errors);
    } catch (err) {
      next(err);
    }
  };
};

export default validate;
