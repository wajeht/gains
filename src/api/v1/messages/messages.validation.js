import { param, body, query } from 'express-validator';
import * as UserQueries from '../users/users.queries.js';

export const getConversations = [
  query('user_id').trim().notEmpty().withMessage('user_id is required').isInt().toInt(),
];

export const getMessages = [
  query('user_id').trim().notEmpty().isInt().toInt(),
  param('other_user_id')
    .trim()
    .notEmpty()
    .isInt()
    .toInt()
    .custom(async (other_user_id) => {
      const user = await UserQueries.findUserById(other_user_id);
      if (user.length === 0) throw new Error('User does not exist!');
      return true;
    }),
  query('perPage').optional().trim().isInt().toInt(),
  query('currentPage').optional().trim().isInt().toInt(),
];

export const postMessage = [
  body('sender_id').trim().notEmpty().isInt().toInt(),
  body('recipient_id')
    .trim()
    .notEmpty()
    .isInt()
    .toInt()
    .custom(async (recipient_id, { req }) => {
      if (recipient_id === req.body.sender_id) {
        throw new Error('Cannot send message to yourself');
      }
      const user = await UserQueries.findUserById(recipient_id);
      if (user.length === 0) throw new Error('Recipient does not exist!');
      return true;
    }),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
];

export const markAsRead = [
  param('message_id').trim().notEmpty().isInt().toInt(),
  body('recipient_id').trim().notEmpty().isInt().toInt(),
];

export const markConversationAsRead = [
  body('user_id').trim().notEmpty().isInt().toInt(),
  param('other_user_id').trim().notEmpty().isInt().toInt(),
];
