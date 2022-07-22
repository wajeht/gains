import { check, param, body } from 'express-validator';
import { blue, custom, green, red, yellow } from '../../../../utils/rainbow-log.js';
import { isEqual } from 'lodash-es';

import * as SetsQueries from './sets.queries.js';
import * as UsersQueries from '../users/users.queries.js';
import * as ExercisesQueries from '../exercises/exercises.queries.js';

/* A validation for the user input. */
export const postSet = [
  body().custom((body) => {
    const requiredFields = [
      'exercise_id',
      'session_id',
      'user_id',
      'reps',
      'weight',
      'rpe',
      'notes',
    ];
    const equal = Object.keys(body).some((key) => requiredFields.indexOf(key) >= 0);
    if (!equal) throw new Error(`Fields must be in  ${requiredFields.join(', ')} format!`);
    return true;
  }),
  body('user_id')
    .trim()
    .notEmpty()
    .withMessage('User id must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('User id must be an ID!')
    .bail()
    .toInt()
    .custom(async (user_id) => {
      const user = await UsersQueries.findUserById(user_id);
      if (user.length === 0) throw new Error('User does not exist!');
      return true;
    }),
  body('exercise_id')
    .trim()
    .notEmpty()
    .withMessage('exercise_id must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('exercise_id must be an ID!')
    .bail()
    .toInt()
    .custom(async (exercise_id) => {
      const user = await ExercisesQueries.getExerciseById(exercise_id);
      if (user.length === 0) throw new Error('exercise_id does not exist!');
      return true;
    }),
  body('session_id')
    .trim()
    .notEmpty()
    .withMessage('session_id must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('session_id must be an number!'),
  body('reps')
    .trim()
    .notEmpty()
    .withMessage('reps must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('reps must be an number!'),
  body('weight')
    .trim()
    .notEmpty()
    .withMessage('weight must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('weight must be an number!'),
  body('rpe').optional().trim().isFloat().withMessage('rpe must be an integer format!'),
  body('notes')
    .optional()
    .trim()
    .isLength({ min: 1, max: 250 })
    .withMessage('Notes must be at least 1 character long or less than 250 characters long'),
];
