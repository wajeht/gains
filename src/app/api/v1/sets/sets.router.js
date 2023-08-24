import * as SetsValidation from './sets.validation.js';
import * as SetsController from './sets.controller.js';

import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import express from 'express';
const sets = express.Router();

/**
 * POST /api/v1/sets
 * @tags sets
 * @summary create a set
 * @param {number} user_id.form.required - the email - application/x-www-form-urlencoded
 * @param {number} exercise_id.form.required - the exercise_id - application/x-www-form-urlencoded
 * @param {number} session_id.form.required - the session_id - application/x-www-form-urlencoded
 * @param {number} reps.form.required - the rpes - application/x-www-form-urlencoded
 * @param {number} weight.form.required - the weight - application/x-www-form-urlencoded
 * @param {number} rpe.form - the rpe - application/x-www-form-urlencoded
 * @param {string} notes.form - the notes - application/x-www-form-urlencoded
 */
sets.post('/', validator(SetsValidation.postSet), catchAsyncErrors(SetsController.postSet));

/**
 * PATCH /api/v1/sets/{id}
 * @tags sets
 * @summary modify a set
 * @param {number} id.path.required - the path - application/x-www-form-urlencoded
 * @param {number} user_id.form.required - the email - application/x-www-form-urlencoded
 * @param {number} exercise_id.form.required - the exercise_id - application/x-www-form-urlencoded
 * @param {number} session_id.form.required - the session_id - application/x-www-form-urlencoded
 * @param {number} reps.form.required - the rpes - application/x-www-form-urlencoded
 * @param {number} weight.form.required - the weight - application/x-www-form-urlencoded
 * @param {number} rpe.form - the rpe - application/x-www-form-urlencoded
 * @param {string} notes.form - the notes - application/x-www-form-urlencoded
 */
sets.patch('/:id', validator(SetsValidation.patchSet), catchAsyncErrors(SetsController.patchSet));

/**
 * DELETE /api/v1/sets/{id}
 * @tags sets
 * @summary delete a set
 * @param {number} id.path.required - the path - application/x-www-form-urlencoded
 * @param {number} session_id.form.required - the session_id - application/x-www-form-urlencoded
 * @param {number} user_id.form.required - the email - application/x-www-form-urlencoded
 */
sets.delete(
  '/:id',
  validator(SetsValidation.deleteSet),
  catchAsyncErrors(SetsController.deleteSet),
);

export default sets;
