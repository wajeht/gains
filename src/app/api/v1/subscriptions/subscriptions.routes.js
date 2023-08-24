import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import express from 'express';
const subscriptions = express.Router();

import * as SubscriptionsControllers from './subscriptions.controllers.js';
import * as SubscriptionsValidations from './subscriptions.validations.js';

/**
 * POST /api/v1/subscriptions/subscribe-changelog
 * @tags subscriptions
 * @summary subscribe to a changelog
 * @param {number} user_id.form.required - the user_id  - application/x-www-form-urlencoded
 * @param {email} email.form.required - the email - application/x-www-form-urlencoded
 */
subscriptions.post(
  '/subscribe-changelog',
  validator(SubscriptionsValidations.postSubscribeChangelog),
  catchAsyncErrors(SubscriptionsControllers.postSubscribeChangelog),
);

/**
 * POST /api/v1/subscriptions/unsubscribe-changelog
 * @tags subscriptions
 * @summary unsubscribe to a changelog
 * @param {number} user_id.form.required - the user_id  - application/x-www-form-urlencoded
 * @param {email} email.form.required - the email - application/x-www-form-urlencoded
 */
subscriptions.post(
  '/unsubscribe-changelog',
  validator(SubscriptionsValidations.postUnsubscribeChangelog),
  catchAsyncErrors(SubscriptionsControllers.postUnsubscribeChangelog),
);

/**
 * GET /api/v1/subscriptions/changelog-subscriptions?email={email}
 * @tags subscriptions
 * @summary check to see if user has subscribed to email
 * @param {email} email.query.required - the email - application/x-www-form-urlencoded
 */
subscriptions.get(
  '/changelog-subscription',
  validator(SubscriptionsValidations.getCheckSubscription),
  catchAsyncErrors(SubscriptionsControllers.getCheckSubscription),
);

export default subscriptions;
