import * as TagsValidations from './tags.validations.js';
import * as TagsControllers from './tags.controllers.js';

import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import express from 'express';
const tags = express.Router();

/**
 * POST /api/v1/tags
 * @tags tags
 * @summary create a tag
 * @param {string} notes.form.required - the tag name - application/x-www-form-urlencoded
 * @param {number} user_id.form.required - the user id - application/x-www-form-urlencoded
 * @param {number} log_id.form.required - the log id - application/x-www-form-urlencoded
 */
tags.post('/', validator(TagsValidations.postTag), catchAsyncErrors(TagsControllers.postTag));

export default tags;
