import * as ExerciseCategoriesController from './exercise-categories.controller.js';
import * as ExerciseCategoriesValidation from './exercise-categories.validation.js';
import { catchAsyncErrors, validator } from '../../api.middlewares.js';

import express from 'express';
const exerciseCategory = express.Router();

exerciseCategory.get(
  '/',
  validator(ExerciseCategoriesValidation.getExerciseCategories),
  catchAsyncErrors(ExerciseCategoriesController.getExerciseCategories),
);

exerciseCategory.post(
  '/',
  validator(ExerciseCategoriesValidation.postExerciseCategory),
  catchAsyncErrors(ExerciseCategoriesController.postExerciseCategory),
);

export default exerciseCategory;
