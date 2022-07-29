import { check, param, body } from 'express-validator';
import * as UsersQueries from '../users/users.queries.js';

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
