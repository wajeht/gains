import { check, checkSchema, param, body } from 'express-validator';
import { blue, custom, green, red, yellow } from '../../../../utils/rainbow-log.js';
import * as UserQueries from '../users/users.queries.js';
import * as SessionsQueries from '../sessions/sessions.queries.js';
import * as CommentsQueries from './comments.queries.js';
import { isEqual } from 'lodash-es';

export const postAComment = [
  body().custom((body) => {
    const requiredFields = ['comment', 'user_id', 'session_id'];
    const bodyFields = Object.keys(body);
    const equal = isEqual(requiredFields.sort(), bodyFields.sort());
    if (!equal) throw new Error('Fields must be in required format!');
    return true;
  }),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('comment must not be empty!')
    .bail()
    .isLength({ min: 1, max: 225 })
    .withMessage('Comment must be at least 1 character long or less than 225 character long'),
  body('user_id')
    .trim()
    .notEmpty()
    .withMessage('user_id must not be empty!')
    .bail()
    .isInt()
    .withMessage('user_id must be an ID!')
    .bail()
    .custom(async (user_id) => {
      const user = await UserQueries.findUserById(user_id);
      if (user.length === 0) throw new Error('User does not exist!');
      return true;
    })
    .toInt(),
  body('session_id')
    .trim()
    .notEmpty()
    .withMessage('session_id must not be empty!')
    .bail()
    .isInt()
    .withMessage('session_id  must be an ID!')
    .bail()
    .custom(async (session_id) => {
      const user = await SessionsQueries.getSessionBySessionId(session_id);
      if (user.length === 0) throw new Error('Session does not exist!');
      return true;
    })
    .toInt(),
];

export const getCommentsOfASession = [
  param('session_id')
    .trim()
    .notEmpty()
    .withMessage('session_id must not be empty!')
    .bail()
    .isInt()
    .withMessage('session_id must be an ID!')
    .bail()
    .custom(async (session_id) => {
      const session = await SessionsQueries.getSessionBySessionId(session_id);
      if (session.length === 0) throw new Error('Session does not exist!');
      return true;
    })
    .toInt(),
];

export const deleteAComment = [
  param('comment_id')
    .trim()
    .notEmpty()
    .withMessage('comment_id must not be empty!')
    .bail()
    .isInt()
    .withMessage('comment_id must be an ID!')
    .bail()
    .custom(async (comment_id, { req }) => {
      const comment = await CommentsQueries.getCommentByCommentId(comment_id);
      const currentUserId = req.user.user_id;

      if (comment.length === 0) throw new Error('comment does not exist!');
      if (currentUserId !== comment[0].user_id) throw new Error('You are not authorized!');
      return true;
    })
    .toInt(),
];
