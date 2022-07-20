import * as ExerciseCategoriesController from './exercise-categories.controller.js';
import * as ExerciseCategoriesValidation from './exercise-categories.validation.js';
import { catchAsyncErrors, validator } from '../../api.middlewares.js';

import express from 'express';
const exerciseCategory = express.Router();

/**
 * GET /api/v1/exercise-categories
 * @tags exercise-categories
 * @summary get a list of all the exercise categories
 */

/**
 * GET /api/v1/exercise-categories?user_id={uid}
 * @tags exercise-categories
 * @summary get a list of all the exercise categories of a user that have exercises linked together
 * @param {string} uid.path.required - the user id - application/x-www-form-urlencoded
 */

/**
 * GET /api/v1/exercise-categories?user_id={uid}&all=true
 * @tags exercise-categories
 * @summary get a list of all the exercise categories of a user
 * @param {string} uid.path.required - the user id - application/x-www-form-urlencoded
 * @param {string} all.path.required - all - application/x-www-form-urlencoded
 */
exerciseCategory.get(
  '/',
  validator(ExerciseCategoriesValidation.getExerciseCategories),
  catchAsyncErrors(ExerciseCategoriesController.getExerciseCategories),
);

/**
 * POST /api/v1/exercise-categories
 * @tags exercise-categories
 * @summary create an exercise category
 * @param {string} name.form.required - the exercise category name - application/x-www-form-urlencoded
 * @param {number} user_id.form.required - the user_id - application/x-www-form-urlencoded
 */
exerciseCategory.post(
  '/',
  validator(ExerciseCategoriesValidation.postExerciseCategory),
  catchAsyncErrors(ExerciseCategoriesController.postExerciseCategory),
);

export default exerciseCategory;
