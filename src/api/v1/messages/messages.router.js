import { validator, catchAsyncErrors } from '../../api.middlewares.js';
import * as MessagesController from './messages.controller.js';
import * as MessagesValidation from './messages.validation.js';

import express from 'express';
const messages = express.Router();

messages.get(
  '/',
  validator(MessagesValidation.getConversations),
  catchAsyncErrors(MessagesController.getConversations),
);

messages.get(
  '/:other_user_id',
  validator(MessagesValidation.getMessages),
  catchAsyncErrors(MessagesController.getMessages),
);

messages.post(
  '/',
  validator(MessagesValidation.postMessage),
  catchAsyncErrors(MessagesController.postMessage),
);

messages.patch(
  '/:message_id/read',
  validator(MessagesValidation.markAsRead),
  catchAsyncErrors(MessagesController.markAsRead),
);

messages.patch(
  '/:other_user_id/read-all',
  validator(MessagesValidation.markConversationAsRead),
  catchAsyncErrors(MessagesController.markConversationAsRead),
);

export default messages;
