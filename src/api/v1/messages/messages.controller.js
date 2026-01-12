import * as MessagesQueries from './messages.queries.js';
import { StatusCodes } from '../../../config/status-codes.js';
import logger from '../../../utils/logger.js';

export async function getConversations(req, res) {
  const { user_id } = req.query;
  const conversations = await MessagesQueries.getConversations(user_id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'Conversations retrieved successfully!',
    data: conversations,
  });
}

export async function getMessages(req, res) {
  const { user_id, perPage, currentPage } = req.query;
  const { other_user_id } = req.params;

  const pagination = {
    perPage: perPage || 50,
    currentPage: currentPage || 1,
  };

  const messages = await MessagesQueries.getMessagesBetweenUsers(
    user_id,
    other_user_id,
    pagination,
  );

  // Mark messages as read
  await MessagesQueries.markConversationAsRead(user_id, other_user_id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'Messages retrieved successfully!',
    data: messages.data,
    pagination: messages.pagination,
  });
}

export async function postMessage(req, res) {
  const { sender_id, recipient_id, content } = req.body;

  const [message] = await MessagesQueries.createMessage(sender_id, recipient_id, content);

  logger.info(`User ${sender_id} sent message to ${recipient_id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'Message sent successfully!',
    data: message,
  });
}

export async function markAsRead(req, res) {
  const { message_id } = req.params;
  const { recipient_id } = req.body;

  const [message] = await MessagesQueries.markAsRead(message_id, recipient_id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'Message marked as read!',
    data: message,
  });
}

export async function markConversationAsRead(req, res) {
  const { user_id } = req.body;
  const { other_user_id } = req.params;

  await MessagesQueries.markConversationAsRead(user_id, other_user_id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'Conversation marked as read!',
  });
}
