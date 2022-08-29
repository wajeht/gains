import { StatusCodes } from 'http-status-codes';
import logger from '../../../../utils/logger.js';
import { omit } from 'lodash-es';
import CustomError from '../../api.errors.js';
import db from '../../../../database/db.js';
import redis from '../../../../utils/redis.js';
import * as CacheQueries from './cache.queries.js';

export async function clearACache(req, res) {
  const key = req.params.cache_key;
  const cleared = await redis.del(key);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: [],
  });
}

export async function clearAllCache(req, res) {
  const user_id = req.params.user_id;
  const cleared = await CacheQueries.deleteAllCachesOfAUser(user_id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: [],
  });
}
