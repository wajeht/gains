import logger from '../../../../utils/logger.js';
import * as CommentsQueries from './comments.queries.js';
import { StatusCodes } from 'http-status-codes';
import redis from '../../../../utils/redis.js';

export async function postAComment(req, res) {
  const body = req.body;

  const created = await CommentsQueries.createComment(body);

  logger.info(
    `User id: ${body.user_id} has created comment id: ${created[0].id}, ${JSON.stringify(
      created[0],
    )}!`,
  );
  await redis.del(`user-id-${body.user_id}-community-sessions`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}

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
