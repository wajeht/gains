import { check, param, body } from 'express-validator';
import { blue, custom, green, red, yellow } from '../../../../utils/rainbow-log.js';
import * as UserQueries from './users.queries.js';
import { isEqual } from 'lodash-es';

/* A validation for the user input. */
export const postUser = [
  body().custom((body) => {
    const requiredFields = ['username', 'password', 'email'];
    const bodyFields = Object.keys(body);
    const equal = isEqual(requiredFields.sort(), bodyFields.sort());
    if (!equal) throw new Error('Fields must be in required format!');
    return true;
  }),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('The value must not be empty!')
    .isEmail()
    .withMessage('The value must be an email!')
    .custom(async (email) => {
      const exist = await UserQueries.findUserByParam({ email });
      if (exist.length !== 0) throw new Error('Username or Email already exist!');
    }),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('The value must not be empty!')
    .isLength({ min: 6, max: 20 })
    .withMessage('The value must be at least 8 character long or less than 20 character long')
    .custom(async (username) => {
      const exist = await UserQueries.findUserByParam({ username });
      if (exist.length !== 0) throw new Error('Username or Email already exist!');
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('The value must not be empty!')
    .isLength({ min: 10, max: 100 })
    .withMessage('The value must be at least 8 character long or less than 100 character long')
    .custom((value) => {
      if (value.split('').some((i) => i == i.toUpperCase())) return true;
    })
    .withMessage('The value must include an uppercase character!')
    .custom((value) => {
      if (value.split('').some((i) => i == i.toLocaleLowerCase())) return true;
    })
    .withMessage('The value must include a lowercase character!')
    .custom((value) => {
      if (/\d/.test(value)) return true;
    })
    .withMessage('The value must include a number character!'),
];

/* Validating the user input. */
export const getUser = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('The value must not be empty!')
    .isInt()
    .withMessage('The value must be an ID!')
    .custom(async (value) => {
      const user = await UserQueries.findUserById(value);
      if (user.length === 0) throw new Error('User does not exist!');
    }),
];

/* Validating the user input. */
export const deleteUser = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('The value must not be empty!')
    .isInt()
    .withMessage('The value must be an ID!')
    .custom(async (value) => {
      const user = await UserQueries.findUserById(value);
      if (user.length === 0) throw new Error('User does not exist!');
    }),
];

/* Validating the user input. */
export const patchUser = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('The value must not be empty!')
    .isInt()
    .withMessage('The value must be an ID!')
    .custom(async (value) => {
      const user = await UserQueries.findUserById(value);
      if (user.length === 0) throw new Error('User does not exist!');
    }),
  body().custom((data) => {
    const availableFields = [
      'email',
      'username',
      'password',
      'first_name',
      'last_name',
      'birth_date',
      'weight',
      'profile_picture_url',
      'user_id',
      'updated_at',
    ];
    const fields = Object.keys(data).some((key) => availableFields.indexOf(key) >= 0);
    if (!fields) throw new Error('Must include some fields to update!');
    return true;
  }),
  // allow for re-update same value
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('The value must be an email!')
    .custom(async (email, { req }) => {
      const exist = await UserQueries.findUserByParam({ email });
      let ok = false;

      if (exist[0]?.id == req.params.id) {
        ok = true;
      } else {
        throw new Error('Username or Email already exist!');
      }

      return ok;
    }),
  // allow for re-update same value
  body('username')
    .optional()
    .isLength({ min: 8, max: 20 })
    .withMessage('The value must be at least 8 character long or less than 20 character long')
    .custom(async (username, { req }) => {
      const exist = await UserQueries.findUserByParam({ username });
      let ok = false;

      if (exist[0]?.id == req.params.id) {
        ok = true;
      } else {
        throw new Error('Username or Email already exist!');
      }

      return ok;
    }),
  body('password')
    .optional()
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage('The value must be at least 8 character long or less than 100 character long')
    .custom((value) => {
      if (value.split('').some((i) => i == i.toUpperCase())) return true;
    })
    .withMessage('The value must include an uppercase character!')
    .custom((value) => {
      if (value.split('').some((i) => i == i.toLocaleLowerCase())) return true;
    })
    .withMessage('The value must include a lowercase character!')
    .custom((value) => {
      if (/\d/.test(value)) return true;
    })
    .withMessage('The value must include a number character!'),
];
