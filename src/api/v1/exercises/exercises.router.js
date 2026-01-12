import * as ExercisesController from './exercises.controller.js';
import * as ExercisesValidation from './exercises.validation.js';
import { catchAsyncErrors, validator } from '../../api.middlewares.js';

import express from 'express';
const exercises = express.Router();

exercises.get(
  '/',
  validator(ExercisesValidation.getExercises),
  catchAsyncErrors(ExercisesController.getExercises),
);

exercises.get(
  '/:eid',
  validator(ExercisesValidation.getExercise),
  catchAsyncErrors(ExercisesController.getExercise),
);

exercises.get(
  '/:exercise_id/history',
  validator(ExercisesValidation.getExerciseHistory),
  catchAsyncErrors(ExercisesController.getExerciseHistory),
);

exercises.post(
  '/',
  validator(ExercisesValidation.postExercise),
  catchAsyncErrors(ExercisesController.postExercise),
);

exercises.patch(
  '/:eid/sessions/:sid/update-exercise-note/:lid',
  validator(ExercisesValidation.patchExerciseNote),
  catchAsyncErrors(ExercisesController.patchExerciseNote),
);

export default exercises;
