import { validator, catchAsyncErrors } from '../api.middlewares.js';

import * as ContactController from './contact.controller.js';
import * as ContactValidation from './contact.validation.js';

import express from 'express';
const contact = express.Router();

contact.post(
  '/',
  validator(ContactValidation.postContact),
  catchAsyncErrors(ContactController.postContact),
);

export default contact;
