import { StatusCodes } from 'http-status-codes';
import logger from '../../../../utils/logger.js';
import cache from '../../../../utils/cache.js';
import * as CacheQueries from './cache.queries.js';

export async function clearACache(req, res) {
  const key = req.params.cache_key;
  const user_id = req.user.user_id;

  await cache.del(key);

  logger.info(`User id ${user_id} has cleared  cache: ${key}!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: [],
  });
}

export async function clearAllCache(req, res) {
  const user_id = req.params.user_id;

  await CacheQueries.deleteAllCachesOfAUser(user_id);

  logger.info(`User id ${user_id} has cleared all of their cached data!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: [],
  });
}
