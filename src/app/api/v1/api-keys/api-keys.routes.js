import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import * as ApiKeysController from './api-keys.controller.js';
import * as ApiKeysValidation from './api-keys.validation.js';

import express from 'express';
const apiKeys = express.Router();

/**
 * GET /api/v1/api-keys/user/{user_id}
 * @tags api-keys
 * @summary get api keys of a user
 * @param {number} user_id.path.required - the user_id - application/x-www-form-urlencoded
 */
apiKeys.get(
  '/user/:user_id',
  validator(ApiKeysValidation.getApiKeysOfAUser),
  catchAsyncErrors(ApiKeysController.getApiKeysOfAUser),
);

/**
 * DELETE /api/v1/api-keys/{api_key_id}
 * @tags api-keys
 * @summary delete a specific key
 * @param {number} api_key_id.path.required - the user_id - application/x-www-form-urlencoded
 */
apiKeys.delete(
  '/:api_key_id',
  validator(ApiKeysValidation.deleteApiKey),
  catchAsyncErrors(ApiKeysController.deleteApiKey),
);

/**
 * POST /api/v1/api-keys
 * @tags api-keys
 * @summary generate api key
 * @param {number} user_id.form.required - the user_id - application/x-www-form-urlencoded
 */
apiKeys.post(
  '/',
  validator(ApiKeysValidation.postGenerateApiKey),
  catchAsyncErrors(ApiKeysController.postGenerateApiKey),
);

export default apiKeys;
