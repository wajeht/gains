import * as SubscriptionsQueries from './subscriptions.queries.js';
import EmailService from '../../../../services/email.service.js';
import logger from '../../../../utils/logger.js';
import { StatusCodes } from 'http-status-codes';
import * as UserQueries from '../users/users.queries.js'

/**
 * It takes a request body, and then creates a subscription in the database
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postSubscribeChangelog(req, res) {
  const body = req.body;

  const subscription = await SubscriptionsQueries.subscribeChangelog(body);

  const [user] = await UserQueries.findUserByParam({ email: body.email });

  EmailService.send({
    to: body.email,
    subject: 'Changelog release subscription',
    template: 'subscribed-to-changelog',
    data: {
      username: user.username,
    },
  });

  logger.info(`User id: ${body.user_id} has created a subscription id: ${subscription[0].id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: subscription,
  });
}

export async function postUnsubscribeChangelog(req, res) {
  const body = req.body;

  const subscription = await SubscriptionsQueries.UnsubscribeChangelog(body);

  const [user] = await UserQueries.findUserByParam({ email: body.email });

  EmailService.send({
    to: body.email,
    subject: 'Changelog release subscription',
    template: 'unsubscribed-to-changelog',
    data: {
      username: user.username,
    },
  });

  logger.info(`User id: ${body.user_id} has updated a subscription id: ${subscription[0].id}`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: subscription,
  });
}

export async function getCheckSubscription(req, res) {
  const { email } = req.query;

  const subscription = await SubscriptionsQueries.hasSubscribedToChangelog(email);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was return successfully!',
    data: subscription,
  });
}
