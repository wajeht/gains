import * as BlocksController from './blocks.controller.js';
import * as BlocksValidation from './blocks.validation.js';
import { catchAsyncErrors, validator } from '../../api.middlewares.js';

import express from 'express';
const blocks = express.Router();

/**
 * GET /api/v1/blocks
 * @tags blocks
 * @summary get a list of all the blocks
 */

/**
 * GET /api/v1/blocks?user_id={uid}
 * @tags blocks
 * @summary get a list of all the blocks of a user
 * @param {string} uid.path.required - the user id - application/x-www-form-urlencoded
 */
blocks.get(
  '/',
  validator(BlocksValidation.getBlocks),
  catchAsyncErrors(BlocksController.getBlocks),
);

/**
 * POST /api/v1/blocks
 * @tags blocks
 * @summary create a new block
 * @param {string} name.form.required - the name - application/x-www-form-urlencoded
 * @param {string} description.form - the description - application/x-www-form-urlencoded
 * @param {date} start_date.form.required - the start_date - application/x-www-form-urlencoded
 * @param {date} end_date.form.required - the end_date - application/x-www-form-urlencoded
 * @param {number} user_id.form.required - the user_id - application/x-www-form-urlencoded
 */
blocks.post(
  '/',
  validator(BlocksValidation.postBlock),
  catchAsyncErrors(BlocksController.postBlock),
);

/**
 * GET /api/v1/blocks/{bid}
 * @tags blocks
 * @summary get details of a specific block
 * @param {number} bid.path.required - the block id - application/x-www-form-urlencoded
 */
blocks.get(
  '/:bid',
  validator(BlocksValidation.getBlock),
  catchAsyncErrors(BlocksController.getBlock),
);

export default blocks;
