import * as ApiKeysQueries from './api-keys.queries.js';
import * as UsersQueries from '../users/users.queries.js';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../../api.errors.js';
import logger from '../../../../utils/logger.js';
import jwt from 'jsonwebtoken';
import { jwt_secret } from '../../../../config/env.js';

/**
 * It gets the api keys of a user
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getApiKeysOfAUser(req, res) {
  const user_id = req.params.user_id;
  const apiKeys = await ApiKeysQueries.getApiKey(user_id);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: apiKeys,
  });
}

/**
 * It creates a new api key for a user
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postGenerateApiKey(req, res) {
  const user_id = req.body.user_id;

  const apiKeys = await ApiKeysQueries.getApiKey(user_id);
  const [user] = await UsersQueries.findUserById(user_id);

  let role;

  if (user.role !== 'admin') {
    role = 'api-user';
  } else {
    role = 'api-admin-user';
  }

  if (apiKeys.length === 5) {
    throw new CustomError.BadRequestError(`You've reached maximum api keys request!`); // prettier-ignore
  }

  const plainApiKey = jwt.sign(
    {
      user_id: user_id,
      role,
    },
    jwt_secret,

    {
      issuer: 'AllKindsOfGains',
    },
  );

  const data = {
    key: plainApiKey,
    user_id,
  };

  const created = await ApiKeysQueries.saveApiKeys(data);

  logger.info(`User id ${user_id} has created api keys id: ${created[0].user_id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}

/**
 * It deletes an api key from the database
 * @param req - The request object.
 * @param res - The response object.
 */
export async function deleteApiKey(req, res) {
  const user_id = req.user.user_id;
  const api_key_id = req.params.api_key_id;

  const deleted = await ApiKeysQueries.deleteApiKey(user_id, api_key_id);

  logger.info(`User id ${user_id} has deleted api key id: ${deleted[0].user_id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: deleted,
  });
}
