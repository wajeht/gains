import logger from '../../../../utils/logger.js';
import * as UsersQueries from '../users//users.queries.js';
import * as CommentsQueries from '../comments//comments.queries.js';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../../api.errors.js';
import { omit, without } from 'lodash-es';
import redis from '../../../../utils/redis.js';

/**
 * It creates a comment in the database and returns the created comment.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postAComment(req, res) {
  const body = req.body;

  const created = await CommentsQueries.createComment(body);

  logger.info(
    `User id: ${body.user_id} has created comment id: ${created[0].id}, ${JSON.stringify(
      created[0],
    )}!`,
  );
  const deletedCacheCommunitySessions = await redis.del(
    `user-id-${body.user_id}-community-sessions`,
  );

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}

/**
 * It gets all the comments for a given session
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getCommentsOfASession(req, res) {
  const session_id = req.params.session_id;

  const comments = await CommentsQueries.getCommentsBySessionId(session_id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was return successfully!',
    data: comments,
  });
}

/**
 * It deletes a comment from the database and returns the deleted comment
 * @param req - The request object.
 * @param res - The response object.
 */
export async function deleteAComment(req, res) {
  const { comment_id } = req.params;

  const deleted = await CommentsQueries.deleteAComment(comment_id);

  logger.info(`User id: ${req.user.user_id} has deleted comment id: ${deleted[0].id}!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was deleted successfully!',
    data: deleted,
  });
}
