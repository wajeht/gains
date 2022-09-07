import { check, param, body, query } from 'express-validator';
import * as UsersQueries from '../users/users.queries.js';

export const postUnsubscribeChangelog = [
  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('email must not be empty!')
    .bail()
    .isEmail()
    .withMessage('email must be an email!')
    .bail()
    .custom(async (email) => {
      if (email) {
        const user = await UsersQueries.findUserByParam({ email });
        if (user.length === 0) throw new Error('email does not exist!');
      }
      return true;
    }),
  body('user_id')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('user_id must not be empty!')
    .bail()
    .isInt()
    .withMessage('user_id must be an ID!')
    .bail()
    .toInt()
    .custom(async (user_id) => {
      if (user_id) {
        const user = await UsersQueries.findUserById(user_id);
        if (user.length === 0) throw new Error('User does not exist!');
      }
      return true;
    })
    .toInt(),
];

export const postSubscribeChangelog = [
  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('email must not be empty!')
    .bail()
    .isEmail()
    .withMessage('email must be an email!')
    .bail()
    .custom(async (email) => {
      if (email) {
        const user = await UsersQueries.findUserByParam({ email });
        if (user.length === 0) throw new Error('email does not exist!');
      }
      return true;
    }),
  body('user_id')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('user_id must not be empty!')
    .bail()
    .isInt()
    .withMessage('user_id must be an ID!')
    .bail()
    .toInt()
    .custom(async (user_id) => {
      if (user_id) {
        const user = await UsersQueries.findUserById(user_id);
        if (user.length === 0) throw new Error('User does not exist!');
      }
      return true;
    })
    .toInt(),
];

export const getCheckSubscription = [
  query('email')
    .trim()
    .notEmpty()
    .withMessage('email must not be empty!')
    .bail()
    .isEmail()
    .withMessage('email must be an email!')
    .bail()
    .custom(async (email) => {
      if (email) {
        const user = await UsersQueries.findUserByParam({ email });
        if (user.length === 0) throw new Error('email does not exist!');
      }
      return true;
    }),
];
