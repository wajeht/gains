import { param, body } from 'express-validator';
import * as SetsQueries from './sets.queries.js';
import * as UsersQueries from '../users/users.queries.js';
import * as ExercisesQueries from '../exercises/exercises.queries.js';
import * as LogsQueries from '../logs/logs.queries.js';

export const postSet = [
  body().custom((body) => {
    const requiredFields = [
      'exercise_id',
      'session_id',
      'log_id',
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
  body('log_id')
    .trim()
    .notEmpty()
    .withMessage('log id must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('log id must be an ID!')
    .bail()
    .toInt()
    .custom(async (log_id) => {
      const log = await LogsQueries.getLogById(log_id);
      if (log.length === 0) throw new Error('Log does not exist!');
      return true;
    })
    .toInt(),
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
    })
    .toInt(),
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
    })
    .toInt(),
  body('session_id')
    .trim()
    .notEmpty()
    .withMessage('session_id must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('session_id must be an number!')
    .toInt(),
  body('reps')
    .trim()
    .notEmpty()
    .withMessage('reps must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('reps must be an number!')
    .toInt(),
  body('weight')
    .trim()
    .notEmpty()
    .withMessage('weight must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('weight must be an number!')
    .toInt(),
  body('rpe').optional().trim().isFloat().withMessage('rpe must be an integer format!').toInt(),
  body('notes')
    .optional()
    .trim()
    .isLength({ min: 0, max: 250 })
    .withMessage('Notes must be at least 0 character long or less than 250 characters long'),
];

export const patchSet = [
  body().custom((body) => {
    const requiredFields = [
      'id',
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
  param('id')
    .trim()
    .notEmpty()
    .withMessage('set id must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('set id must be an ID!')
    .bail()
    .toInt()
    .custom(async (id) => {
      const set = await SetsQueries.getSetById(id);
      if (set.length === 0) throw new Error('Set does not exist!');
      return true;
    })
    .toInt(),
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
    })
    .toInt(),
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
    })
    .toInt(),
  body('session_id')
    .trim()
    .notEmpty()
    .withMessage('session_id must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('session_id must be an number!')
    .toInt(),
  body('reps')
    .trim()
    .notEmpty()
    .withMessage('reps must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('reps must be an number!')
    .toInt(),
  body('weight')
    .trim()
    .notEmpty()
    .withMessage('weight must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('weight must be an number!')
    .toInt(),
  body('rpe').optional().trim().isFloat().withMessage('rpe must be an integer format!').toInt(),
  body('notes')
    .optional()
    .trim()
    .isLength({ min: 0, max: 250 })
    .withMessage('Notes must be at least 1 character long or less than 250 characters long'),
];

export const deleteSet = [
  body().custom((body) => {
    const requiredFields = ['id', 'session_id', 'user_id'];
    const equal = Object.keys(body).some((key) => requiredFields.indexOf(key) >= 0);
    if (!equal) throw new Error(`Fields must be in  ${requiredFields.join(', ')} format!`);
    return true;
  }),
  param('id')
    .trim()
    .notEmpty()
    .withMessage('set id must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('set id must be an ID!')
    .bail()
    .toInt()
    .custom(async (id) => {
      const set = await SetsQueries.getSetById(id);
      if (set.length === 0) throw new Error('Set does not exist!');
      return true;
    })
    .toInt(),
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
    })
    .toInt(),
  body('session_id')
    .trim()
    .notEmpty()
    .withMessage('session_id must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('session_id must be an number!')
    .toInt(),
];
