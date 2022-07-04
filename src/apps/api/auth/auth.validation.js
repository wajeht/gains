import { check, param, body } from 'express-validator';
import * as UserQueries from '../v1/users/users.queries.js';
import { isEqual } from 'lodash-es';
import Password from '../../../libs/password.js';

/* A validation for the user input. */
export const postLogin = [
  // only certain fields are allow
  body().custom((body) => {
    const requiredFields = ['email', 'password'];
    const bodyFields = Object.keys(body);
    const equal = isEqual(requiredFields.sort(), bodyFields.sort());
    if (!equal) throw new Error('Fields must be in required format!');
    return true;
  }),
  // check for email
  body('email')
    .trim()
    .notEmpty()
    .withMessage('The value must not be empty!')
    .isEmail()
    .withMessage('The value must be an email!')
    .custom(async (email) => {
      const exist = await UserQueries.findUserByParam({ email });
      if (exist.length === 0) throw new Error('The email or password is wrong!');
    }),
  // check for password
  body('password')
    .notEmpty()
    .withMessage('The value must not be empty!')
    .trim()
    .custom(async (password, { req }) => {
      const { email } = req.body;
      const exist = await UserQueries.findUserByParam({ email });
      if (exist.length === 0) throw new Error('Email or password is wrong!');
      const oldPassword = exist[0]?.password;

      const samePassword = await Password.compare(password, oldPassword);
      if (!samePassword) throw new Error('The email or password is wrong!');
    }),
];

/* A validation for the user input. */
export const postSignup = [
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
