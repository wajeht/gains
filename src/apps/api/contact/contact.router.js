import catchAsyncError from '../middlewares/catch-async-errors.middleware.js';
import validator from '../middlewares/validator.middleware.js';

import * as ContactController from './contact.controller.js';
import * as ContactValidation from './contact.validation.js';

import express from 'express';
const contact = express.Router();

contact.post(
  '/',
  validator(ContactValidation.postContact),
  catchAsyncError(ContactController.postContact),
);

export default contact;
