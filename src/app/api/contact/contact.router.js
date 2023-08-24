import { validator, catchAsyncErrors } from '../api.middlewares.js';

import * as ContactController from './contact.controller.js';
import * as ContactValidation from './contact.validation.js';

import express from 'express';
const contact = express.Router();

/**
 * POST /api/contact
 * @tags contact
 * @summary create a contact
 * @param {string} email.form.required - the email - application/x-www-form-urlencoded
 * @param {string} subject.form.required - the subject - application/x-www-form-urlencoded
 * @param {string} message.form.required - the message - application/x-www-form-urlencoded
 */
contact.post(
  '/',
  validator(ContactValidation.postContact),
  catchAsyncErrors(ContactController.postContact),
);

export default contact;
