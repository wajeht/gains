import * as GainsMetaController from './gains-meta.controller.js';
import * as GainsMetaValidation from './gains-meta.validation.js';

import express from 'express';
const gainsMeta = express.Router();

import { validator, catchAsyncErrors } from '../../api.middlewares.js';

/**
 * POST /api/v1/gains-meta
 * @tags gains-mega
 * @summary create gains meta information
 * @param {number} user_id.form.required - the user_id - application/x-www-form-urlencoded
 * @param {string} object.form.required - the object - application/x-www-form-urlencoded
 * @param {number} object_id.form.required - the object_id - application/x-www-form-urlencoded
 * @param {string} description.form.required - the description - application/x-www-form-urlencoded
 * @param {json} json.form.required - the json - application/x-www-form-urlencoded
 */
gainsMeta.post(
  '/',
  validator(GainsMetaValidation.postMeta),
  catchAsyncErrors(GainsMetaController.postMeta),
);

export default gainsMeta;
