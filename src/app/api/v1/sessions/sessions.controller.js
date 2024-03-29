import * as SessionQueries from './sessions.queries.js';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../../utils/logger.js';
import { omit } from 'lodash-es';
import CustomError from '../../api.errors.js';
import db from '../../../../database/db.js';
import redis from '../../../../utils/redis.js';

export async function postCreateSession(req, res) {
  const body = req.body;
  const { user_id } = req.body;
  const created = await SessionQueries.createASession(body);

  if (!created.length) throw new CustomError.BadRequestError(`Something went wrong while creating a session for for  User ID: ${body.user_id}!`); // prettier-ignore
  redis.del(`user-id-${user_id}-sessions`);

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

  // TODO! move this to a query
  await db
    .update({ collapsed: false })
    .from('logs')
    .where({ session_id: sid })
    .andWhere({ user_id: uid });

  // delete cache so if they fetch again, they will get new cache query
  redis.del(`user-id-${body.user_id}-sessions`);

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

  if (pagination.currentPage > 1) {
    redis.del(`user-id-${user_id}-sessions`);
    const sessions = await SessionQueries.getSessionsByUserId(user_id, pagination);
    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      data: sessions.data,
      pagination: sessions.pagination,
    });
  }

  let sessions = JSON.parse(await redis.get(`user-id-${user_id}-sessions`));

  if (sessions === null) {
    sessions = await SessionQueries.getSessionsByUserId(user_id, pagination);
    redis.set(`user-id-${user_id}-sessions`, JSON.stringify(sessions));
  }

  // if (!sessions.data.length) throw new CustomError.BadRequestError(`There are no sessions available for user id ${user_id}!`); // prettier-ignore

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

  redis.del(`user-id-${uid}-sessions`);
  redis.del(`user-id-${uid}-community-sessions`);

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

  // if (!sessions.length) throw new CustomError.BadRequestError(`There are no session with videos available available for user id ${user_id}!`); // prettier-ignore

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: sessions,
  });
}

export async function getAllSessions(req, res) {
  const user_id = req.user.user_id;

  const { perPage, currentPage, cache } = req.query;

  const pagination = {
    perPage: perPage ?? null,
    currentPage: currentPage ?? null,
  };

  if (cache == false) {
    const sessions = await SessionQueries.getAllSessions(pagination);
    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      cache: cache,
      data: sessions.data,
      pagination: sessions.pagination,
    });
  }

  if (pagination.currentPage > 1) {
    redis.del(`user-id-${user_id}-community-sessions`);
    const sessions = await SessionQueries.getAllSessions(pagination);
    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      data: sessions.data,
      pagination: sessions.pagination,
    });
  }

  let sessions = JSON.parse(await redis.get(`user-id-${user_id}-community-sessions`));

  if (sessions === null) {
    sessions = await SessionQueries.getAllSessions(pagination);
    redis.set(`user-id-${user_id}-community-sessions`, JSON.stringify(sessions));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: sessions.data,
    pagination: sessions.pagination,
  });
}
