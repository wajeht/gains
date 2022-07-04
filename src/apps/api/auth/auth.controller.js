import { StatusCodes } from 'http-status-codes';
import { jwt_secret } from '../../../config/env.js';
import * as AuthService from './auth.service.js';
import * as UsersQueries from '../v1/users/users.queries.js';
import jwt from 'jsonwebtoken';
import logger from '../../../libs/logger.js';
import Password from '../../../libs/password.js';

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
  const hashedPassword = await Password.hash(req.body.password);
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  };
  const user = await UsersQueries.createUser(newUser);
  logger.info(`user ${user[0].id} was created!`);

  // TODO!: send email verification for user
  res.json(user);
}

export function getLogout(req, res) {}
