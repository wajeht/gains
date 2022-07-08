import express from 'express';
import * as AuthController from './auth.controller.js';
import * as AuthValidation from './auth.validation.js';
import { validator, catchAsyncErrors } from '../api.middlewares.js';

const auth = express.Router();

auth.get('/logout', AuthController.getLogout);

/**
 * GET /api/auth/verify-email/{uid}
 * @tags auth
 * @summary verify email address of an account creation
 * @param {number} uid.path.required - user id
 * @param {string} token.query.required - verification token
 */
auth.get(
  '/verify-email/:uid',
  validator(AuthValidation.getVerifyEmail),
  catchAsyncErrors(AuthController.getVerifyEmail),
);

/**
 * POST /api/auth/login
 * @tags auth
 * @summary login to an account
 * @param {string} email.form.required - the email - application/x-www-form-urlencoded
 * @param {string} password.form.required - the password - application/x-www-form-urlencoded
 */
auth.post(
  '/login',
  validator(AuthValidation.postLogin),
  catchAsyncErrors(AuthController.postLogin),
);

/**
 * POST /api/auth/forget-password
 * @tags auth
 * @summary generate a reset password link to an email
 * @param {string} email.form.required - the email - application/x-www-form-urlencoded
 */
auth.post(
  '/forget-password',
  validator(AuthValidation.postForgetPassword),
  catchAsyncErrors(AuthController.postForgetPassword),
);

/**
 * POST /api/auth/reset-password
 * @tags auth
 * @summary reset an account password
 * @param {number} uid.form.required - the user id - application/x-www-form-urlencoded
 * @param {string} token.form.required - the token - application/x-www-form-urlencoded
 * @param {string} newPassword.form.required - the new password - application/x-www-form-urlencoded
 * @param {string} newConfirmedPassword.form.required - the new confirmed password - application/x-www-form-urlencoded
 */
auth.post(
  '/reset-password',
  validator(AuthValidation.postResetPassword),
  catchAsyncErrors(AuthController.postResetPassword),
);

/**
 * POST /api/auth/signup
 * @tags auth
 * @summary sign up for an account
 * @param {string} email.form.required - the email - application/x-www-form-urlencoded
 * @param {string} username.form.required - the username - application/x-www-form-urlencoded
 * @param {string} password.form.required - the password - application/x-www-form-urlencoded
 */
auth.post(
  '/signup',
  validator(AuthValidation.postSignup),
  catchAsyncErrors(AuthController.postSignup),
);

/**
 * GET /api/auth/reverify
 * @tags auth
 * @summary resend verification link to email
 * @param {string} email.query.required - verification token
 */
auth.get(
  '/reverify',
  validator(AuthValidation.getReverify),
  catchAsyncErrors(AuthController.getReverify),
);

export default auth;
