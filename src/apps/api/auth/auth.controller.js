import { StatusCodes } from 'http-status-codes';
import * as AuthQueries from './auth.queries.js';
import * as UsersQueries from '../v1/users/users.queries.js';
import logger from '../../../utils/logger.js';
import Password from '../../../utils/password.js';
import EmailService from '../../../services/email.service.js';
import crypto from 'crypto';
import CustomError from '../api.errors.js';
import { red } from '../../../utils/rainbow-log.js';
import { env, domain, jwt_secret } from '../../../config/env.js';
import jwt from 'jsonwebtoken';
import pkg from '../../../utils/pkg.js';

import generateDefaultExercises from '../../../utils/generate-default-exercises.js';

/**
 * It takes in a request and a response object, and returns a JSON object with a token
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postLogin(req, res) {
  const { email, remember_me } = req.body;
  let [user] = await UsersQueries.findUserByParam({ email });
  [user] = await UsersQueries.findUserById(user.id);

  let token = null;

  if (remember_me) {
    token = jwt.sign(
      {
        user_id: user.id,
        role: user.role,
      },
      jwt_secret,
      {
        issuer: 'AllKindsOfGains',
        expiresIn: '1d',
      },
    );

    res.cookie('token', token, {
      expiresIn: '1d',
      httpOnly: true,
      secure: env === 'production',
      signed: true,
    });
  } else {
    token = jwt.sign(
      {
        user_id: user.id,
        role: user.role,
      },
      jwt_secret,
      {
        issuer: 'AllKindsOfGains',
        expiresIn: '1h',
      },
    );

    res.cookie('token', token, {
      expiresIn: '1h',
      httpOnly: true,
      secure: env === 'production',
      signed: true,
    });
  }

  logger.info(`User id ${user.id} has logged-in!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [
      {
        id: user.id,
        role: user.role,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        weight: user.weight,
        profile_picture_url: user.profile_picture_url,
        // token,
      },
    ],
    appVersion: pkg.version,
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

  // if /api/auth/signup?verify=true
  // we skip sending email for verification
  const { verify } = req.query;
  if (verify === true) {
    console.log({ verify });
    const date = new Date();
    const [verifiedUser] = await AuthQueries.verifyUser(user.id, date);

    logger.info(`User id ${user.id} was auto verified because of verify query!`);

    const gde = await generateDefaultExercises(user.id);

    logger.info(`Generated default exercises for User id ${user.id}!`);

    user.verified = true;

    return res.status(StatusCodes.CREATED).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was created successfully!',
      data: [user],
    });
  }

  let origin = '';

  if (env === 'development') {
    const protocol = req.protocol;
    const hostname = req.get('host');
    origin = `${protocol}://${hostname}`;
  } else {
    origin = domain;
  }

  // send verification email
  await EmailService.send({
    to: newUser.email,
    subject: 'Verify Email',
    template: 'verify-email',
    data: {
      username: newUser.username,
      verificationLink: `${origin}/verify-email/${user.id}?token=${verificationToken}`,
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

/**
 * It takes the user ID from the URL, and then it verifies the user by updating the user's verified
 * column to true
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getVerifyEmail(req, res) {
  const { uid } = req.params;
  const date = new Date();
  const verified = await AuthQueries.verifyUser(uid, date);

  if (!verified) throw new CustomError.BadRequestError(`Something went wrong with verifying user id ${uid}!`); // prettier-ignore

  logger.info(`User id ${uid} was successfully verified!`);

  const gde = await generateDefaultExercises(uid);

  logger.info(`Generated default exercises for User id ${uid}!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: `User ID: ${uid} was successfully verified!`,
  });
}

/**
 * It sends a re-verification email to the user
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getReverify(req, res) {
  const { email } = req.query;
  let user = await UsersQueries.findUserByParam({ email });

  logger.info(`Email re-verification request was initiated for ${email}`);

  if (!user.length) logger.info(`${email} does not exist in our system.`);

  if (user.length) {
    const [user_details] = await UsersQueries.findUserById(user[0]?.id);
    [user] = user;

    if (true) {
      user = user_details;

      let origin = '';

      const verificationToken = user.verification_token;

      if (env === 'development') {
        const protocol = req.protocol;
        const hostname = req.get('host');
        origin = `${protocol}://${hostname}`;
      } else {
        origin = domain;
      }

      // re send verification email
      await EmailService.send({
        to: user.email,
        subject: 'Verify Email',
        template: 'verify-email',
        data: {
          username: user.username,
          verificationLink: `${origin}/verify-email/${user.id}?token=${verificationToken}`,
        },
      });

      logger.info(`Re-verification email was sent to uid: ${user.id}`);
    }
  }

  // but we send this regardless
  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'If you have an account with us, well will send a re-verification link to your email!',
    data: [],
  });
}

/**
 * We are generating a password reset token, saving it to the database, and sending it to the user's
 * email
 * @param req - The request object.
 * @param res - the response object
 */
export async function postForgetPassword(req, res) {
  const { email } = req.body;

  let user = await UsersQueries.findUserByParam({ email });

  logger.info(`Password request was initiated from ${email}`);

  // only continue password reset verification generation
  //  if we have found user in the database
  if (user.length) {
    [user] = user;

    let origin = '';

    if (env === 'development') {
      const protocol = req.protocol;
      const hostname = req.get('host');
      origin = `${protocol}://${hostname}`;
    } else {
      origin = domain;
    }

    const passwordResetToken = crypto.randomBytes(64).toString('hex');
    const tenMinutes = 1000 * 60 * 10; // milliseconds * 1 minute * 10
    const passwordResetTokenExpiration = new Date(Date.now() + tenMinutes);

    const generated = await AuthQueries.generatePasswordResetToken(
      user.id,
      passwordResetToken,
      passwordResetTokenExpiration,
    );

    if (!generated) {
      const msg = `Something went wrong with generating password token for User ID: ${uid}!`;
      logger.info(msg);
      throw new CustomError.BadRequestError(msg);
    }

    const sent = await EmailService.send({
      to: user.email,
      subject: 'Password Reset',
      template: 'forget-password',
      data: {
        username: user.username,
        passwordResetLink: `${origin}/reset-password/${user.id}?token=${passwordResetToken}`,
      },
    });

    logger.info(`Password reset link was send to ${email}`);

    if (!sent) throw new CustomError.BadRequestError(`Something went went wrong while sending password reset to ${user.email}!`); // prettier-ignore
  }

  // but we send this regardless
  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'If you have an account with us, well will send a reset password link to your email!',
    data: [],
  });
}

/**
 * It updates the user's password and removes the password reset token and expiration date
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postResetPassword(req, res) {
  const { newPassword, uid } = req.body;
  const newHashedPassword = await Password.hash(newPassword);

  const updated = await UsersQueries.updateUserById(uid, {
    password: newHashedPassword,
    password_reset_token: null,
    password_reset_token_expiration: null,
  });

  if (!updated) {
    throw new CustomError.BadRequestError(
      `Something went wrong while updating new password for ${updated[0]?.email} `,
    );
  }

  logger.info(`UserID: ${uid} has successfully updated password resetting process!`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: updated,
  });
}

/**
 * It sets the accessToken cookie to expire immediately, and returns a success response
 * @param req - The request object.
 * @param res - The response object.
 */
export function getLogout(req, res) {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [{}],
  });
}
