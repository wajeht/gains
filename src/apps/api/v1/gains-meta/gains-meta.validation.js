import { check, param, body } from 'express-validator';
import * as GainsMetaQueries from './gains-meta.queries.js';
import * as UsersQueries from '../users/users.queries.js';

export const postMeta = [
  body().custom((body) => {
    const requiredFields = ['user_id', 'object', 'object_id', 'description', 'json'];
    const equal = Object.keys(body).some((key) => requiredFields.indexOf(key) >= 0);
    if (!equal) throw new Error(`Must include ${requiredFields.join(', ')} to update!`);
    return true;
  }),
  check('user_id')
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
  body('object').trim().notEmpty().withMessage('object must not be empty!'),
  body('object_id')
    .notEmpty()
    .withMessage('object_id must not be empty!')
    .bail()
    .trim()
    .isNumeric()
    .withMessage('object_id id must be an number!'),
  body('description').optional().trim().notEmpty().withMessage('description must not be empty!'),
  body('json').optional().trim().notEmpty().withMessage('json must not be empty'),
];
