import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const validate = (schemas) => {
  return async (req, res, next) => {
    try {
      await Promise.all(schemas.map((schema) => schema.run(req)));

      const result = validationResult(req);

      if (result.isEmpty()) {
        return next();
      }

      const { errors } = result;

      const e = new Error();
      e.statusCode = StatusCodes.BAD_REQUEST;
      e.message = 'Validation errors in your request!';
      e.errors = errors;
      next(errors);

      //   // TODO: Fix this
      //   return res.status(StatusCodes.BAD_REQUEST).json({
      //     status: "failed",
      //     request_url: req.originalUrl,
      //     message: "Validation errors in your request!",
      //     errors,
      //   });
    } catch (err) {
      next(err);
    }
  };
};

export default validate;
