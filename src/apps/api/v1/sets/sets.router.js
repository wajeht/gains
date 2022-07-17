import * as SetsValidation from './sets.validation.js';
import * as SetsController from './sets.controller.js';

import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import express from 'express';
const sets = express.Router();

/**
 * POST /api/v1/sets
 * @tags sets
 * @summary create a set
 * @param {string} email.form.required - the email - application/x-www-form-urlencoded
 * @param {string} username.form.required - the username - application/x-www-form-urlencoded
 * @param {string} password.form.required - the password - application/x-www-form-urlencoded
 */
sets.post('/', validator(SetsValidation.postSet), catchAsyncErrors(SetsController.postSet));

export default sets;
