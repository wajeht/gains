import { validator, catchAsyncErrors } from '../../api.middlewares.js';
import * as MessagesController from './messages.controller.js';
import * as MessagesValidation from './messages.validation.js';

import express from 'express';
const messages = express.Router();

// Get all conversations for a user
messages.get(
  '/',
  validator(MessagesValidation.getConversations),
  catchAsyncErrors(MessagesController.getConversations),
);

// Get messages between two users
messages.get(
  '/:other_user_id',
  validator(MessagesValidation.getMessages),
  catchAsyncErrors(MessagesController.getMessages),
);

// Send a message
messages.post(
  '/',
  validator(MessagesValidation.postMessage),
  catchAsyncErrors(MessagesController.postMessage),
);

// Mark single message as read
messages.patch(
  '/:message_id/read',
  validator(MessagesValidation.markAsRead),
  catchAsyncErrors(MessagesController.markAsRead),
);

// Mark all messages in conversation as read
messages.patch(
  '/:other_user_id/read-all',
  validator(MessagesValidation.markConversationAsRead),
  catchAsyncErrors(MessagesController.markConversationAsRead),
);

export default messages;
