import { check, param, body } from 'express-validator';
import { isEqual } from 'lodash-es';

import * as UsersQueries from '../users/users.queries.js';
import * as LogsQueries from '../logs/logs.queries.js';
import * as TagsQueries from './tags.queries.js';

export const postTag = [
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
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name id must not be empty!')
    .bail()
    .isLength({ min: 1, max: 20 })
    .withMessage('name must be at least 1 character long or less than 20 characters long'),
];
