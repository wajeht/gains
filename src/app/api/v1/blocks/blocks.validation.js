import { check, param, body } from 'express-validator';
import { blue, custom, green, red, yellow } from '../../../../utils/rainbow-log.js';
import { isEqual } from 'lodash-es';
import * as BlocksQueries from './blocks.queries.js';
import * as UserQueries from '../users/users.queries.js';

export const getBlock = [
  param('bid')
    .trim()
    .notEmpty()
    .withMessage('Block id must not be empty!')
    .isInt()
    .withMessage('Block id must be an ID!')
    .custom(async (bid) => {
      const block = await BlocksQueries.getBlockByBlockId(bid);
      if (!block.length) {
        throw new Error(`Block id ${bid} does not exist!`);
      }
      return true;
    }),
];

export const getBlocks = [
  check('user_id')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('User id must not be empty!')
    .isInt()
    .withMessage('User id must be an ID!')
    .custom(async (user_id) => {
      const user = await UserQueries.findUserById(user_id);
      if (user.length === 0) throw new Error('User does not exist!');
      return true;
    }),
];

export const postBlock = [
  body().custom((body) => {
    const requiredFields = ['name', 'description (required)', 'start_date', 'end_date', 'user_id'];
    const equal = Object.keys(body).some((key) => requiredFields.indexOf(key) >= 0);
    if (!equal) throw new Error(`Must include ${requiredFields.join(', ')} to update!`);
    return true;
  }),
  body('name').trim().notEmpty().withMessage('Name must not be empty!'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description must not be empty!')
    .isLength({ min: 1, max: 100 })
    .withMessage('Description must be at least 8 character long or less than 100 character long'),
  body('start_date')
    .trim()
    .notEmpty()
    .withMessage('Start date must not be empty!')
    .isISO8601()
    .toDate()
    .withMessage('Start date must be in date format'),
  body('end_date')
    .trim()
    .notEmpty()
    .withMessage('End date must not be empty!')
    .isISO8601()
    .toDate()
    .withMessage('End date must be in date format'),
  body('user_id')
    .trim()
    .notEmpty()
    .withMessage('User id must not be empty!')
    .isInt()
    .withMessage('User id must be an ID!')
    .custom(async (user_id) => {
      const user = await UserQueries.findUserById(user_id);
      if (user.length === 0) throw new Error('User does not exist!');
      return true;
    }),
];
