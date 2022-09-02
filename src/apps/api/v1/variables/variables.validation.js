import { check, param, body, query } from 'express-validator';
import * as UsersQueries from '../users/users.queries.js';

/* Validating the user_id. */
export const getOpenPowerliftingResult = [
  query('q')
    .trim()
    .notEmpty()
    .withMessage('search text must not be empty!')
    .bail()
    .isLength({ min: 1, max: 30 })
    .withMessage('search text must be at least 1 character long or less than 30 character long')
    .bail(),
];

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
  query('perPage')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('perPage must not be empty!')
    .bail()
    .isInt()
    .withMessage('perPage must be an ID!')
    .bail()
    .toInt(),
  query('currentPage')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('current-page must not be empty!')
    .bail()
    .isInt()
    .withMessage('current-page must be an ID!')
    .bail()
    .toInt(),
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
