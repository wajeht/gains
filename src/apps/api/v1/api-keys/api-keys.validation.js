import { check, checkSchema, param, body } from 'express-validator';
import * as ApiKeysQueries from './api-keys.queries.js';
import * as UsersQueries from '../users/users.queries.js';

/* Validating the user_id. */
export const getApiKeysOfAUser = [
  param('user_id')
    .trim()
    .notEmpty()
    .withMessage('user_id must not be empty!')
    .bail()
    .isInt()
    .withMessage('user_id must be an ID!')
    .bail()
    .custom(async (user_id) => {
      const user = await UsersQueries.findUserById(user_id);
      if (user.length === 0) throw new Error('User does not exist!');
      return true;
    })
    .toInt(),
];

/* Validating the user_id. */
export const postGenerateApiKey = [
  body('user_id')
    .trim()
    .notEmpty()
    .withMessage('user_id must not be empty!')
    .bail()
    .isInt()
    .withMessage('user_id must be an ID!')
    .bail()
    .custom(async (user_id) => {
      const user = await UsersQueries.findUserById(user_id);
      if (user.length === 0) throw new Error('User does not exist!');
      return true;
    })
    .toInt(),
];

/* Validating the api_key_id. */
export const deleteApiKey = [
  param('api_key_id')
    .trim()
    .notEmpty()
    .withMessage('api_key_id must not be empty!')
    .bail()
    .isInt()
    .withMessage('api_key_id must be an ID!')
    .bail()
    .custom(async (api_key_id) => {
      const api = await ApiKeysQueries.getApiKeyByApiId(api_key_id);
      if (api.length === 0) throw new Error('api_key_id does not exist!');
      return true;
    })
    .toInt(),
];
