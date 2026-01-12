import * as SessionQueries from './sessions.queries.js';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../utils/logger.js';
import { omit } from 'lodash-es';
import CustomError from '../../api.errors.js';
import db from '../../../db/db.js';

export async function postCreateSession(req, res) {
  const body = req.body;
  const created = await SessionQueries.createASession(body);

  if (!created.length) throw new CustomError.BadRequestError(`Something went wrong while creating a session for for  User ID: ${body.user_id}!`); // prettier-ignore

  logger.info(`UserID: ${body.user_id} has created a SessionID: ${created[0].id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}

export async function patchSession(req, res) {
  const body = req.body;
  const sid = req.params.sid;
  const uid = req.body.user_id;

  const fields = ['id', 'user_id'];
  const b = omit(body, ...fields);

  const updated = await SessionQueries.updateSession(sid, uid, b);

  logger.info(`User id ${req.body.user_id} has updated session details to ${JSON.stringify(b)}!`);

  await db
    .update({ collapsed: false })
    .from('logs')
    .where({ session_id: sid })
    .andWhere({ user_id: uid });

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: updated,
  });
}

export async function getSession(req, res) {
  const sid = req.params.sid;
  const session = await SessionQueries.getSessionBySessionId(sid);

  if (!session.length) throw new CustomError.BadRequestError(`There are no session available for session id ${sid}!`); // prettier-ignore

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: session,
  });
}

export async function getUserSessions(req, res) {
  const user_id = req.query.user_id;
  const { perPage, currentPage } = req.query;

  const pagination = {
    perPage: perPage ?? null,
    currentPage: currentPage ?? null,
  };

  const sessions = await SessionQueries.getSessionsByUserId(user_id, pagination);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: sessions.data,
    pagination: sessions.pagination,
  });
}

export async function deleteSession(req, res) {
  const sid = req.params.sid;
  const uid = req.body.user_id;
  const session = await SessionQueries.softDeleteSession(sid, uid);

  if (!session.length) throw new CustomError.BadRequestError(`Something went wrong while deleting session id ${sid}!`); // prettier-ignore

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was deleted successfully!',
    data: session,
  });
}

export async function getSessionsWithVideos(req, res) {
  const user_id = req.params.user_id;
  const sessions = await SessionQueries.sessionsWithVideosByUserId(user_id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: sessions,
  });
}

export async function getAllSessions(req, res) {
  const { perPage, currentPage } = req.query;

  const pagination = {
    perPage: perPage ?? null,
    currentPage: currentPage ?? null,
  };

  const sessions = await SessionQueries.getAllSessions(pagination);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: sessions.data,
    pagination: sessions.pagination,
  });
}
