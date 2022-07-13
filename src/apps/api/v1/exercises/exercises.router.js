import * as ExercisesController from './exercises.controller.js';
import * as ExercisesValidation from './exercises.validation.js';
import { catchAsyncErrors, validator } from '../../api.middlewares.js';

import express from 'express';
const exercises = express.Router();

/**
 * GET /api/v1/exercises
 * @tags exercises
 * @summary get a list of all the exercises
 */

/**
 * GET /api/v1/exercises?user_id={uid}
 * @tags exercises
 * @summary get a list of all the exercises of a user
 * @param {string} uid.path.required - the user_id - application/x-www-form-urlencoded
 */
exercises.get(
  '/',
  validator(ExercisesValidation.getExercises),
  catchAsyncErrors(ExercisesController.getExercises),
);

/**
 * POST /api/v1/exercises
 * @tags exercises
 * @summary create an exercise
 * @param {string} name.form.required - the name - application/x-www-form-urlencoded
 * @param {number} exercise_category_id.form.required - the exercise_category_id - application/x-www-form-urlencoded
 * @param {number} user_id.form.required - the user_id - application/x-www-form-urlencoded
 */
exercises.post(
  '/',
  validator(ExercisesValidation.postExercise),
  catchAsyncErrors(ExercisesController.postExercise),
);

export default exercises;
