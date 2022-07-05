import { StatusCodes } from 'http-status-codes';
import { jwt_secret } from '../../../config/env.js';
import * as AuthQueries from './auth.queries.js';
import * as UsersQueries from '../v1/users/users.queries.js';
import logger from '../../../libs/logger.js';
import Password from '../../../libs/password.js';
import EmailService from '../../../services/email.service.js';
import crypto from 'crypto';
import CustomError from '../errors/custom-error.error.js';

export async function postLogin(req, res) {
  // TODO!: send back a token
  res.json({
    msg: 'ok',
  });
}

/**
 * It takes the user's password, hashes it, creates a new user object, and then creates a new user in
 * the database
 * @param req - the request object
 * @param res - the response object
 */
export async function postSignup(req, res) {
  const verificationToken = crypto.randomBytes(64).toString('hex');
  const hashedPassword = await Password.hash(req.body.password);

  const newUser = {
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  };
  // create user
  const [user] = await UsersQueries.createUser(newUser, verificationToken);
  logger.info(`User ID: ${user.id} was created!`);

  // send verification email
  await EmailService.send({
    to: newUser.email,
    subject: 'Verify Email',
    template: 'verify-email',
    data: {
      username: newUser.username,
      verificationLink: `http://localhost:8080/verify-email/${user.id}?token=${verificationToken}`,
    },
  });
  logger.info(`Verification email was sent to uid: ${user.id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: [user],
  });
}

export async function getVerifyEmail(req, res) {
  const { uid } = req.params;
  const verified = await AuthQueries.verifyUser(uid);

  if (!verified) throw CustomError.BadRequestError('Something went wrong with verifying process!');

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: `User ID: ${uid} was successfully verified!`,
  });
}

export function getLogout(req, res) {}
