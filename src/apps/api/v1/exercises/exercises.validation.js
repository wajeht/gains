import { body, check, param, query } from 'express-validator';
import * as UsersQueries from '../users/users.queries.js';
import * as ExercisesQueries from './exercises.queries.js';
import * as LogsQueries from '../logs/logs.queries.js';
import * as ExerciseCategoriesQueries from '../exercise-categories/exercise-categories.queries.js';
import * as SessionsQueries from '../sessions/sessions.queries.js';
import { isEqual } from 'lodash-es';

export const getExercise = [
  param('eid')
    .trim()
    .notEmpty()
    .withMessage('exercise id must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('exercise id must be an number!')
    .bail()
    .toInt(),
];

export const getExercises = [
  check('user_id')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('User id must not be empty!')
    .bail()
    .isInt()
    .withMessage('User id must be a number!')
    .bail()
    .custom(async (user_id) => {
      const user = await UsersQueries.findUserById(parseInt(user_id));
      if (user.length === 0) throw new Error('User does not exist!');
      return true;
    }),
  check('category_id')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('category_id must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('category_id must be an ID!')
    .toInt()
    .custom(async (ecid) => {
      const user = await ExerciseCategoriesQueries.getExerciseCategoriesById(ecid);
      if (user.length === 0) throw new Error('category_id does not exist!');
      return true;
    }),
];

export const postExercise = [
  body().custom((body) => {
    const requiredFields = ['name', 'exercise_category_id', 'user_id'];
    const bodyFields = Object.keys(body);
    const equal = isEqual(requiredFields.sort(), bodyFields.sort());
    if (!equal) throw new Error(`Must include ${requiredFields.join(', ')} to update!`);
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
  body('exercise_category_id')
    .trim()
    .notEmpty()
    .withMessage('exercise_category_id must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('exercise_category_id must be an ID!')
    .toInt()
    .custom(async (ecid) => {
      const user = await ExerciseCategoriesQueries.getExerciseCategoriesById(ecid);
      if (user.length === 0) throw new Error('exercise_category_id does not exist!');
      return true;
    }),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name must not be empty!')
    .custom(async (name, { req }) => {
      const uid = req.body.user_id;
      const ecid = req.body.exercise_category_id;
      const result = await ExercisesQueries.searchExerciseName(name, uid, ecid); // prettier-ignore
      if (result.length) throw new Error('Exercise name already exist!');
      return true;
    }),
];

export const patchExerciseNote = [
  body('notes')
    .trim()
    .isLength({ min: 0, max: 250 })
    .withMessage('Notes must be at least 0 character long or less than 250 characters long'),
  param('lid')
    .trim()
    .notEmpty()
    .withMessage('lid must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('lid must be an ID!')
    .bail()
    .toInt()
    .custom(async (lid) => {
      const log = await LogsQueries.getLogById(lid);
      if (log.length === 0) throw new Error('Log does not exist!');
      return true;
    })
    .toInt(),
  param('sid')
    .trim()
    .notEmpty()
    .withMessage('sid must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('sid must be an ID!')
    .bail()
    .toInt()
    .custom(async (sid) => {
      const user = await SessionsQueries.getSessionBySessionId(sid);
      if (user.length === 0) throw new Error('session id does not exist!');
      return true;
    }),
  param('eid')
    .trim()
    .notEmpty()
    .withMessage('eid must not be empty!')
    .bail()
    .isNumeric()
    .withMessage('eid must be an ID!')
    .bail()
    .toInt()
    .custom(async (eid) => {
      const exercise = await ExercisesQueries.getExerciseById(eid);
      if (exercise.length === 0) throw new Error('exercise id does not exist!');
      return true;
    }),
];
