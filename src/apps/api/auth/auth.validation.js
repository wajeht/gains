import { param, body, query } from 'express-validator';
import * as UserQueries from '../v1/users/users.queries.js';
import { isEqual } from 'lodash-es';
import Password from '../../../utils/password.js';
import { red } from '../../../utils/rainbow-log.js';
import logger from '../../../utils/logger.js';
import requestIp from 'request-ip';

/* A validation for the user input. */
export const getReverify = [
  // check for email
  query('email')
    .trim()
    .notEmpty()
    .withMessage('Email must not be empty!')
    .isEmail()
    .withMessage('Email must be an email!'),
];

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
    .withMessage('Email must not be empty!')
    .isEmail()
    .withMessage('Email must be an email!')
    // check to see if exist exist or not
    .custom(async (email) => {
      const exist = await UserQueries.findUserByParam({ email });
      if (exist[0].deleted === true) throw new Error('This account has been deleted!');
      if (exist?.length === 0) throw new Error('The email or password is wrong!');
      return true;
    })
    // check to see if acc has been verified
    .custom(async (email) => {
      const user = await UserQueries.findUserByParam({ email });
      if (user.length === 0) return false;
      const verified = await UserQueries.findUserById(user[0]?.id);
      if (!verified[0].verified) throw new Error('You must verify your account before logging in. Please verify your account by click a verification link which was sent to your email!'); // prettier-ignore
      return true;
    }),
  // check for password
  body('password')
    .notEmpty()
    .withMessage('Password must not be empty!')
    .trim()
    .custom(async (password, { req }) => {
      const { email } = req.body;
      const exist = await UserQueries.findUserByParam({ email });
      if (exist.length === 0) throw new Error('Email or password is wrong!');
      const oldPassword = exist[0]?.password;

      const samePassword = await Password.compare(password, oldPassword);
      if (!samePassword) throw new Error('The email or password is wrong!');
      return true;
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
    .withMessage('Email must not be empty!')
    .isEmail()
    .withMessage('Email must be an email!')
    .custom(async (email) => {
      const exist = await UserQueries.findUserByParam({ email });
      if (exist.length !== 0) throw new Error('Username or Email already exist!');
      return true;
    }),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username must not be empty!')
    .isLength({ min: 6, max: 20 })
    .withMessage('Username must be at least 8 character long or less than 20 character long')
    .custom(async (username) => {
      const exist = await UserQueries.findUserByParam({ username });
      if (exist.length !== 0) throw new Error('Username or Email already exist!');
      return true;
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password must not be empty!')
    .isLength({ min: 10, max: 100 })
    .withMessage('Password must be at least 8 character long or less than 100 character long')
    .custom((value) => {
      if (!(value.split('').some((i) => i == i.toUpperCase()))) throw new Error('Password must include an uppercase character!'); // prettier-ignore
      return true;
    })
    .custom((value) => {
      if (!(value.split('').some((i) => i == i.toLocaleLowerCase()))) throw new Error('Password must include a lowercase character!'); // prettier-ignore
      return true;
    })
    .custom((value) => {
      if (!/\d/.test(value)) throw new Error('Password must include a number character!');
      return true;
    }),
];

/* A validation for the user input. */
export const getVerifyEmail = [
  param('uid')
    .trim()
    .notEmpty()
    .withMessage('User ID must not be empty!')
    .isInt()
    .withMessage('User ID must be an integer!')
    // check to see if user exist in database
    .custom(async (uid) => {
      const exist = await UserQueries.findUserByParam({ id: uid });
      // user does not exist
      // TODO!: we should not return invalid uid for security
      red('TODO!: we should not return invalid uid for security');
      if (exist.length === 0) {
        throw new Error(`User ID: ${uid} is invalid to verify email process!`);
      }
      return true;
    })
    // check to see if user has already verified email
    .custom(async (uid) => {
      const [user] = await UserQueries.findUserById(uid);
      if (user.verified === true) throw new Error('This account have been already verified!');
      return true;
    }),
  query('token')
    .trim()
    .notEmpty()
    .withMessage('Token must not be empty!')
    .custom(async (token, { req }) => {
      const { uid } = req.params;
      const [user] = await UserQueries.findUserById(uid);
      if (token !== user.verification_token) throw new Error('Invalid verification token. Cannot continue email verifying process!'); // prettier-ignore
      return true;
    }),
];

/* A validation for the user input. */
export const postForgetPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email must not be empty!')
    .isEmail()
    .withMessage('Email must be an email!')
    // check to see if acc has been verified
    // ! Do we need this code below?
    .custom(async (email) => {
      const user = await UserQueries.findUserByParam({ email });
      if (user.length === 0) return false;
      const verified = await UserQueries.findUserById(user[0]?.id);
      if (!verified[0].verified) {
        logger.info(`UserID: ${user.id} attempt to login without verifying email!`);
        throw new Error('You must verify your account before logging in. Please verify your account by click a verification link which was sent to your email!'); // prettier-ignore
      }
      return true;
    }),
];

/* A validation for the user input. */
export const postResetPassword = [
  body('uid')
    .trim()
    .notEmpty()
    .withMessage('User ID must not be empty!')
    .isInt()
    .withMessage('User ID must be an integer!')
    // check to see if user exist in database
    .custom(async (uid, { req }) => {
      const ip = requestIp.getClientIp(req);
      const exist = await UserQueries.findUserByParam({ id: uid });
      // user does not exist
      red('TODO!: we should not return invalid uid for security');
      if (exist.length === 0) {
        logger.info(`IP: ${ip} attempt to proceed to reset password with invalid UserID: ${uid}!`);
        throw new Error(`User ID: ${uid} is invalid to proceed password resetting process!`); // prettier-ignore
      }
      return true;
    }),
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Token must not be empty!')
    .custom(async (token, { req }) => {
      const { uid } = req.body;
      const user = await UserQueries.findUserById(uid);
      if (user.length === 0) return false;
      // check if token is same
      if (token !== user[0]?.password_reset_token) {
        logger.info(`UserID: ${user[0].id} attempt reset password with invalid token!`);
        throw new Error('Invalid password reset token. Cannot continue resetting password process!'); // prettier-ignore
      }

      // check if token has expired
      const currentTime = new Date();
      if (user[0].password_reset_token_expiration < currentTime) {
        logger.info(`UserID: ${user[0].id} attempt reset password with expired token!`);
        throw new Error('Your process reset process was expired. Please request a new reset again!'); // prettier-ignore
      }
      return true;
    }),
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password must not be empty!')
    .isLength({ min: 8, max: 100 })
    .withMessage('New password must be at least 8 character long or less than 100 character long')
    .custom((value) => {
      if (!value.split('').some((i) => i == i.toUpperCase())) {
        throw new Error('New password must include an uppercase character!');
      }
      return true;
    })
    .custom((value) => {
      if (!value.split('').some((i) => i == i.toLocaleLowerCase())) throw new Error('New password must include a lowercase character!'); // prettier-ignore
      return true;
    })
    .custom((value) => {
      if (!(/\d/.test(value))) throw new Error('New password must include a number character!'); // prettier-ignore
      return true;
    }),
  body().custom((body) => {
    const { newPassword, newConfirmedPassword } = body;
    if (newPassword !== newConfirmedPassword) throw new Error('Both new password and new confirmed password must be the same!'); // prettier-ignore
    return true;
  }),
];
