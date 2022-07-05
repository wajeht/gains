import { param, body, query } from 'express-validator';
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

/* A validation for the user input. */
export const getVerifyEmail = [
  param('uid')
    .trim()
    .notEmpty()
    .withMessage('The value must not be empty!')
    .isInt()
    .withMessage('The value must be an uid!')
    // check to see if user exist in database
    .custom(async (uid) => {
      const exist = await UserQueries.findUserByParam({ id: uid });
      // user does not exist
      // TODO!: we should not return invalid uid for security
      if (exist.length === 0)
        throw new Error(`User ID: ${uid} is invalid to verify email process!`);
    })
    // check to see if user has already verified email
    .custom(async (uid) => {
      const [user] = await UserQueries.findUserById(uid);
      if (user.is_verified === true) throw new Error('This account have been already verified!');
    }),
  query('token')
    .trim()
    .notEmpty()
    .withMessage('The value must not be empty!')
    .custom(async (token, { req }) => {
      const { uid } = req.params;
      const [user] = await UserQueries.findUserById(uid);
      if (token !== user.verification_token) throw new Error('Invalid verification token. Cannot continue email verifying process!'); // prettier-ignore
    }),
];
