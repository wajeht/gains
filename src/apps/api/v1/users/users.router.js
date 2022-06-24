import express from 'express';
import * as UsersController from './users.controller.js';
import * as UsersValidation from './users.validation.js';
import validator from '../../middlewares/validator.middleware.js';

import catchAsyncErrors from '../../middlewares/catch-async-errors.middleware.js';

const users = express.Router();

// prettier-ignore
users.route('/')
  .get(catchAsyncErrors(UsersController.getUsers))
  .post(validator(UsersValidation.postUser), UsersController.postUser);

// prettier-ignore
users.route('/:id')
  .get(UsersController.getUser)
  .patch(UsersController.getUser)
  .delete(UsersController.deleteUser);

export default users;
