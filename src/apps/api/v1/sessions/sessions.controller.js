import * as SessionQueries from './sessions.queries.js';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../../libs/logger.js';
import { omit } from 'lodash-es';
import CustomError from '../../api.errors.js';

/**
 * It creates a session for a user
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postCreateSession(req, res) {
  const body = req.body;
  const created = await SessionQueries.createASession(body);

  if (!created.length) {
    throw new CustomError.BadRequestError(
      `Something went wrong while creating a session for for  User ID: ${body.user_id}!`,
    );
  }

  logger.info(`UserID: ${body.user_id} has created a SessionID: ${created[0].id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}

/**
 * It fetches a session by its session id
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getSession(req, res) {
  const sid = req.params.sid;
  const session = await SessionQueries.getSessionBySessionId(sid);

  if (!session.length) {
    throw new CustomError.BadRequestError(
      `Something went wrong while fetching a session id ${sid}!`,
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: session,
  });
}

/**
 * It fetches all sessions for a given user ID
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getUserSessions(req, res) {
  const user_id = req.query.user_id;
  const sessions = await SessionQueries.getSessionsByUserId(user_id);

  if (!sessions.length) {
    throw new CustomError.BadRequestError(
      `Something went wrong while fetching sessions for for  User ID: ${user_id}!`,
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: sessions,
  });
}
