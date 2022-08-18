import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import * as CommentsController from './comments.controller.js';
import * as CommentsValidation from './comment.validation.js';

import express from 'express';
const comments = express.Router();

/**
 * DELETE /api/v1/comments/{comment_id}
 * @tags comments
 * @summary delete a comment
 */
comments.delete(
  '/:comment_id',
  validator(CommentsValidation.deleteAComment),
  catchAsyncErrors(CommentsController.deleteAComment),
);

/**
 * GET /api/v1/comments
 * @tags comments
 * @summary post a comment to a session
 */
comments.post(
  '/',
  validator(CommentsValidation.postAComment),
  catchAsyncErrors(CommentsController.postAComment),
);

/**
 * GET /api/v1/comments/sessions/{session_id}
 * @tags comments
 * @summary get comments of a session
 * @param {number} session_id.path.required - the session id
 */
comments.get(
  '/sessions/:session_id',
  validator(CommentsValidation.getCommentsOfASession),
  catchAsyncErrors(CommentsController.getCommentsOfASession),
);

export default comments;
