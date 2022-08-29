import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import * as CacheControllers from './cache.controllers.js';
import * as CacheValidations from './cache.validations.js';

import express from 'express';
const cache = express.Router();

/**
 * GET /api/v1/cache/{cache_key}
 * @tags cache
 * @summary clear a cache from redis
 * @param {number} cache_key.path.required - the cache id
 */
cache.post(
  '/:cache_key/clear',
  validator(CacheValidations.clearACache),
  catchAsyncErrors(CacheControllers.clearACache),
);

/**
 * GET /api/v1/cache/user/{user_id}
 * @tags cache
 * @summary clear all cache of a user from redis
 * @param {number} user_id.path.required - the user id
 */
cache.post(
  '/user/:user_id',
  validator(CacheValidations.clearAllCache),
  catchAsyncErrors(CacheControllers.clearAllCache),
);

export default cache;
