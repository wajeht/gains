import { check, query, param, body } from 'express-validator';
import * as UserQueries from '../users/users.queries.js';
import * as ExerciseCategoriesQueries from './exercise-categories.queries.js';
import { isNumber } from 'lodash-es';

/* Checking the user_id to make sure it is an integer and that it exists. */
export const getExerciseCategories = [
  query('user_id')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('User id must not be empty!')
    .isNumeric()
    .withMessage('User id must be a number!')
    .bail()
    .custom(async (user_id) => {
      if (typeof parseInt(user_id) !== 'number') throw new Error('user_id must be a number');
      const user = await UserQueries.findUserById(user_id);
      if (user.length === 0) throw new Error('User does not exist!');
      return true;
    }),
];

/* Checking the body of the request to make sure it has the required fields. */
export const postExerciseCategory = [
  body().custom((body) => {
    const requiredFields = ['name', 'user_id'];
    const equal = Object.keys(body).some((key) => requiredFields.indexOf(key) >= 0);
    if (!equal) throw new Error(`Must include ${requiredFields.join(', ')} to update!`);
    return true;
  }),
  body('user_id')
    .trim()
    .notEmpty()
    .withMessage('User id must not be empty!')
    .isNumeric()
    .withMessage('User id must be a number!')
    .bail()
    .custom(async (user_id) => {
      if (typeof parseInt(user_id) !== 'number') throw new Error('User id must be a number');
      const user = await UserQueries.findUserById(user_id);
      if (user.length === 0) throw new Error('User does not exist!');
      return true;
    }),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name must not be empty!')
    .bail()
    .custom(async (name, { req }) => {
      const uid = req.body.user_id;
      const result = await ExerciseCategoriesQueries.searchExerciseCategoryName(name, uid); // prettier-ignore
      if (result.length) throw new Error('Exercise category name already exist!');
      return true;
    }),
];
