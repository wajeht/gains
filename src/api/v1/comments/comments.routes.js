import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import * as CommentsController from './comments.controller.js';
import * as CommentsValidation from './comment.validation.js';

import express from 'express';
const comments = express.Router();

comments.delete(
  '/:comment_id',
  validator(CommentsValidation.deleteAComment),
  catchAsyncErrors(CommentsController.deleteAComment),
);

comments.post(
  '/',
  validator(CommentsValidation.postAComment),
  catchAsyncErrors(CommentsController.postAComment),
);

comments.get(
  '/sessions/:session_id',
  validator(CommentsValidation.getCommentsOfASession),
  catchAsyncErrors(CommentsController.getCommentsOfASession),
);

export default comments;
