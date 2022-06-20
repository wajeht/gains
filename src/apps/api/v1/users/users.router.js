import express from 'express';
import * as UsersController from './users.controller.js';
import * as UsersValidation from './users.validation.js';
import validator from '../../middlewares/validator.middleware.js';

const users = express.Router();

users.route('/').get(UsersController.getUsers).post(validator(UsersValidation.postUser), UsersController.postUser);

users.route('/:id').get(UsersController.getUser).patch(UsersController.getUser).delete(UsersController.deleteUser);

export default users;
