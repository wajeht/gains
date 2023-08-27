import logger from '../../../../utils/logger.js';
import * as UsersQueries from './users.queries.js';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../../api.errors.js';
import { omit } from 'lodash-es';
import * as CacheQueries from '../cache/cache.queries.js';
import * as JobsServices from '../../../../services/job.services.js';
import redis from '../../../../utils/redis.js';
import db from '../../../../database/db.js';

export async function getCheckAuthentication(req, res) {
  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [],
  });
}

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

export async function getUsers(req, res) {
  let search = '';

  if (req.query.search) {
    search = req.query.search;
  }

  const { perPage, currentPage, cache } = req.query;

  const pagination = {
    perPage: perPage ?? null,
    currentPage: currentPage ?? null,
  };

  let users;

  // /api/v1/users?cache=false
  if (cache === false) {
    users = await UsersQueries.getAllUsers({ pagination, search });

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
    redis.del(`user-id-${req.user.user_id}-users`);

    users = await UsersQueries.getAllUsers({ pagination, search });

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
    users = await UsersQueries.getAllUsers({ pagination, search });

    redis.set(`user-id-${req.user.user_id}-users`, JSON.stringify(users));
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

export async function patchUser(req, res) {
  const { id } = req.params;
  const user = await UsersQueries.updateUserById(id, req.body);

  redis.del(`user-id-${req.user.user_id}-users`);

  logger.info(`User id ${id} has updated user details to ${JSON.stringify(req.body)}!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: user,
  });
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await UsersQueries.deleteUser(id);

  logger.info(`UserID: ${id} has disabled their account!`);

  if (user.id === req.user.user_id) {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
  }

  await redis.del(`user-id-${req.user.user_id}-users`);

  const withoutPassword = omit(user[0], ['password', 'deleted']);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was deleted successfully!',
    data: [withoutPassword],
  });
}

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

export async function postUpdateProfilePicture(req, res, _next) {
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

export async function postDeleteUserData(req, res) {
  const { user_id } = req.params;
  const deleted = await UsersQueries.deleteUserData(user_id);

  logger.info(
    `User id ${user_id} has deleted all of comments, videos, variables, sets, logs, sessions and blocks`,
  );

  await CacheQueries.deleteAllCachesOfAUser(user_id);

  logger.info(`User id ${user_id} has cleared all of their cached data!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: deleted,
  });
}

export async function postRestoreUserData(req, res) {
  const { user_id } = req.params;

  await UsersQueries.restoreUserData(user_id);

  logger.info(`User id ${user_id} has restore all of their data!`);

  await CacheQueries.deleteAllCachesOfAUser(user_id);

  logger.info(`User id ${user_id} has cleared all of their cached data!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: [],
  });
}

export async function postRestoreUser(req, res) {
  const { user_id } = req.params;

  const restore = await UsersQueries.postRestoreUser(user_id);

  logger.info(`User id ${user_id} has been restored!`);

  await CacheQueries.deleteAllCachesOfAUser(user_id);

  logger.info(`User id ${user_id} has cleared all of their cached data!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: restore,
  });
}

export async function getDownloadUserData(req, res) {
  const { user_id } = req.params;

  // let countOfRequests = JSON.parse(
  //   await redis.get(`user-id-${user_id}-request-download-user-data`),
  // );

  // if (countOfRequests === null) {
  //   redis.set(`user-id-${user_id}-request-download-user-data`, 1);
  // } else {
  //   redis.set(`user-id-${user_id}-request-download-user-data`, (countOfRequests += 1));
  // }

  // if (countOfRequests > 5) {
  //   throw new CustomError.BadRequestError('You have read the maximum limit of 5 requests per day!');
  // }

  JobsServices.downloadUserData(user_id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [],
  });
}

export async function postFollowUser(req, res) {
  const data = await db
    .insert({
      follower_id: req.body.follower_id,
      following_id: req.params.following_id,
    })
    .into('follows')
    .returning('*');

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data,
  });
}

export async function getUserFollowers(req, res) {
  const [user] = await db
    .select('*')
    .from('users')
    .rightJoin('user_details', 'users.id', '=', 'user_details.user_id')
    .where({ 'users.id': req.params.user_id });

  const followings = await db('follows')
    .join('users', 'follows.following_id', '=', 'users.id')
    .join('user_details', 'users.id', '=', 'user_details.user_id')
    .select('users.*', 'user_details.*')
    .where('follows.follower_id', req.params.user_id);

  const followers = await db('follows')
    .join('users', 'follows.follower_id', '=', 'users.id')
    .join('user_details', 'users.id', '=', 'user_details.user_id')
    .select('users.*', 'user_details.*')
    .where('follows.following_id', req.params.user_id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [
      {
        user: {
          ...user,
          followers,
          followings,
        },
      },
    ],
  });
}
