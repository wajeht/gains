import express from 'express';
import * as AuthController from './auth.controller.js';
import * as AuthValidation from './auth.validation.js';
import validator from '../middlewares/validator.middleware.js';
import catchAsyncErrors from '../middlewares/catch-async-errors.middleware.js';

const auth = express.Router();

auth.get('/logout', AuthController.getLogout);

auth.post(
  '/login',
  validator(AuthValidation.postLogin),
  catchAsyncErrors(AuthController.postLogin),
);

auth.post(
  '/signup',
  validator(AuthValidation.postSignup),
  catchAsyncErrors(AuthController.postSignup),
);

export default auth;
