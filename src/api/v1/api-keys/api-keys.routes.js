import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import * as ApiKeysController from './api-keys.controller.js';
import * as ApiKeysValidation from './api-keys.validation.js';

import express from 'express';
const apiKeys = express.Router();

apiKeys.get(
  '/user/:user_id',
  validator(ApiKeysValidation.getApiKeysOfAUser),
  catchAsyncErrors(ApiKeysController.getApiKeysOfAUser),
);

apiKeys.delete(
  '/:api_key_id',
  validator(ApiKeysValidation.deleteApiKey),
  catchAsyncErrors(ApiKeysController.deleteApiKey),
);

apiKeys.post(
  '/',
  validator(ApiKeysValidation.postGenerateApiKey),
  catchAsyncErrors(ApiKeysController.postGenerateApiKey),
);

export default apiKeys;
