import { check, param, body } from 'express-validator';
import * as UsersQueries from '../users/users.queries.js';

/* Validating the user_id. */
export const getWeeklyWeightIn = [
  param('user_id')
    .trim()
    .notEmpty()
    .withMessage('User id must not be empty!')
    .bail()
    .isInt()
    .withMessage('User id must be an number!')
    .bail()
    .custom(async (user_id) => {
      if (user_id) {
        const user = await UsersQueries.findUserById(user_id);
        if (user.length === 0) throw new Error('User does not exist!');
      }
      return true;
    })
    .toInt(),
];

/* Validating the user_id. */
export const getRecentPrs = [
  param('user_id')
    .trim()
    .notEmpty()
    .withMessage('User id must not be empty!')
    .bail()
    .isInt()
    .withMessage('User id must be an number!')
    .bail()
    .custom(async (user_id) => {
      if (user_id) {
        const user = await UsersQueries.findUserById(user_id);
        if (user.length === 0) throw new Error('User does not exist!');
      }
      return true;
    })
    .toInt(),
];

export const getRecovery = [
  param('user_id')
    .trim()
    .notEmpty()
    .withMessage('User id must not be empty!')
    .bail()
    .isInt()
    .withMessage('User id must be an number!')
    .bail()
    .custom(async (user_id) => {
      if (user_id) {
        const user = await UsersQueries.findUserById(user_id);
        if (user.length === 0) throw new Error('User does not exist!');
      }
      return true;
    })
    .toInt(),
];
