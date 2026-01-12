import * as BlocksController from './blocks.controller.js';
import * as BlocksValidation from './blocks.validation.js';
import { catchAsyncErrors, validator } from '../../api.middlewares.js';

import express from 'express';
const blocks = express.Router();

blocks.get(
  '/',
  validator(BlocksValidation.getBlocks),
  catchAsyncErrors(BlocksController.getBlocks),
);

blocks.post(
  '/',
  validator(BlocksValidation.postBlock),
  catchAsyncErrors(BlocksController.postBlock),
);

blocks.get(
  '/:bid',
  validator(BlocksValidation.getBlock),
  catchAsyncErrors(BlocksController.getBlock),
);

export default blocks;
