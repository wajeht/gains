import * as CacheQueries from './cache.queries.js';
import * as UsersQueries from '../users/users.queries.js';

import { param } from 'express-validator';

export const clearACache = [
  param('cache_key')
    .trim()
    .notEmpty()
    .withMessage('cache_key id must not be empty!')
    .bail()
    .custom(async (cache_key) => {
      if (cache_key) {
        const cache = await CacheQueries.getCacheByKey(cache_key);
        if (cache === null) throw new Error('cache does not exist!');
      }
      return true;
    }),
];

export const clearAllCache = [
  param('user_id')
    .trim()
    .notEmpty()
    .withMessage('user_id id must not be empty!')
    .bail()
    .isInt()
    .withMessage('user_id id must not an integer format!')
    .bail()
    .custom(async (user_id) => {
      if (user_id) {
        const user = await UsersQueries.findUserById(user_id);
        if (user.length === 0) throw new Error('user does not exist!');
      }
      return true;
    }),
];
