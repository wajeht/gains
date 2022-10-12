import logger from '../../../../utils/logger.js';
import * as UsersQueries from './users.queries.js';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../../api.errors.js';
import { omit, without } from 'lodash-es';
import * as CacheQueries from '../cache/cache.queries.js';
import * as JobsServices from '../../../../services/job.services.js';
import redis from '../../../../utils/redis.js';

/**
 * check to see if a current users authentication is still valid
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getCheckAuthentication(req, res) {
  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [],
  });
}

/**
 * It creates a user and returns the user
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postUser(req, res) {
  const user = await UsersQueries.createUser(req.body);

  logger.info(`User ${user[0].id} was created!`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: user,
  });
}

/**
 * It's an async function that gets all users from the database and returns them as a JSON object
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getUsers(req, res) {
  const { email } = req.query;

  const { perPage, currentPage, cache } = req.query;

  const pagination = {
    perPage: perPage ?? null,
    currentPage: currentPage ?? null,
  };

  let users;

  // /api/v1/users?cache=false
  if (cache === false) {
    if (email) {
      users = await UsersQueries.getAllUsers({ email, pagination });
    } else {
      users = await UsersQueries.getAllUsers({ pagination });
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      cache,
      data: users.data,
      pagination: users.pagination,
    });
  }

  // only cache page 1
  // don't cache any results after page 1
  if (pagination.currentPage > 1) {
    await redis.del(`user-id-${req.user.user_id}-users`);

    if (email) {
      users = await UsersQueries.getAllUsers({ email, pagination });
    } else {
      users = await UsersQueries.getAllUsers({ pagination });
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      cache,
      data: users.data,
      pagination: users.pagination,
    });
  }

  users = JSON.parse(await redis.get(`user-id-${req.user.user_id}-users`));

  if (users === null) {
    if (email) {
      users = await UsersQueries.getAllUsers({ email, pagination });
    } else {
      users = await UsersQueries.getAllUsers({ pagination });
    }

    await redis.set(`user-id-${req.user.user_id}-users`, JSON.stringify(users));
  }

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    cache,
    data: users.data,
    pagination: users.pagination,
  });
}

/**
 * This function gets a user by id and returns it as JSON.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getUser(req, res) {
  const { id } = req.params;
  const user = await UsersQueries.findUserById(id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: user,
  });
}

/**
 * This function will update a user by id, and return the updated user.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function patchUser(req, res) {
  const { id } = req.params;
  const user = await UsersQueries.updateUserById(id, req.body);

  logger.info(`User id ${id} has updated user details to ${JSON.stringify(req.body)}!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: user,
  });
}

/**
 * It takes the id from the request parameters, calls the deleteUser function from the UsersQueries,
 * and returns the result as a JSON response
 * @param req - The request object.
 * @param res - The response object.
 */
export async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await UsersQueries.deleteUser(id);

  logger.info(`UserID: ${id} has disabled their account!`);

  // clear jwt token
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  const withoutPassword = omit(user[0], ['password', 'deleted']);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was deleted successfully!',
    data: [withoutPassword],
  });
}

/**
 * It updates the personal information of a user
 * @param req - The request object.
 * @param res - The response object.
 */
export async function patchUpdatePersonalInformation(req, res) {
  const { id } = req.params;
  const body = req.body;
  const updated = await UsersQueries.updatePersonalInformation(id, body);

  if (!updated.length) throw new CustomError.BadRequestError(`Something went wrong while updating personal info for  User ID: ${id}!`); // prettier-ignore

  logger.info(`User id ${id} has updated personal information to ${JSON.stringify(body)}!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: updated,
  });
}

/**
 * It takes in a user's ID and a body of data, and updates the user's account information
 * @param req - The request object.
 * @param res - The response object.
 */
export async function patchUpdateAccountInformation(req, res) {
  const { id } = req.params;
  const body = req.body;
  const updated = await UsersQueries.updateAccountInformation(id, body);

  logger.info(`User id ${id} has updated account information to ${JSON.stringify(body)}!`);

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: updated,
  });
}

/**
 * It updates the profile picture of a user
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 */
export async function postUpdateProfilePicture(req, res, next) {
  const { path: profile_picture_path } = req.file;
  const profile_picture_url = req.file.path.split('public')[1];
  const { user_id } = req.body;

  const updated = await UsersQueries.updateProfilePicture({
    profile_picture_path,
    profile_picture_url,
    user_id,
  });

  logger.info(`User id ${user_id} was updated profile picture !`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: updated,
  });
}

/**
 * It deletes all of the user's data from the database.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postDeleteUserData(req, res) {
  const { user_id } = req.params;
  const deleted = await UsersQueries.deleteUserData(user_id);

  logger.info(
    `User id ${user_id} has deleted all of comments, videos, variables, sets, logs, sessions and blocks`,
  );

  const cleared = await CacheQueries.deleteAllCachesOfAUser(user_id);

  logger.info(`User id ${user_id} has cleared all of their cached data!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: deleted,
  });
}

/**
 * It restores all of the user's data.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postRestoreUserData(req, res) {
  const { user_id } = req.params;

  const restore = await UsersQueries.restoreUserData(user_id);

  logger.info(`User id ${user_id} has restore all of their data!`);

  const cleared = await CacheQueries.deleteAllCachesOfAUser(user_id);

  logger.info(`User id ${user_id} has cleared all of their cached data!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: [],
  });
}

/**
 * It restores a user's account and clears all of their cached data.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postRestoreUser(req, res) {
  const { user_id } = req.params;

  const restore = await UsersQueries.postRestoreUser(user_id);

  logger.info(`User id ${user_id} has been restored!`);

  const cleared = await CacheQueries.deleteAllCachesOfAUser(user_id);

  logger.info(`User id ${user_id} has cleared all of their cached data!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: restore,
  });
}

/**
 * It downloads user data and sends it to the user's email
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getDownloadUserData(req, res) {
  const { user_id } = req.params;

  let countOfRequests = JSON.parse(
    await redis.get(`user-id-${user_id}-request-download-user-data`),
  );

  if (countOfRequests === null) {
    redis.set(`user-id-${user_id}-request-download-user-data`, 1);
  } else {
    redis.set(`user-id-${user_id}-request-download-user-data`, (countOfRequests += 1));
  }

  if (countOfRequests > 5) {
    throw new CustomError.BadRequestError('You have read the maximum limit of 5 requests per day!');
  }

  await JobsServices.downloadUserData(user_id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [],
  });
}
