import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import * as VariablesValidation from './variables.validation.js';
import * as VariablesController from './variables.controller.js';

import express from 'express';
const variables = express.Router();

/**
 * GET /api/v1/variables/weekly-weight-in/{user_id}
 * @tags variables
 * @summary get weekly weight of a user
 * @param {number} user_id.path.required - the user_id - application/x-www-form-urlencoded
 */
variables.get(
  '/weekly-weight-in/:user_id',
  validator(VariablesValidation.getWeeklyWeightIn),
  catchAsyncErrors(VariablesController.getWeeklyWeightIn),
);

/**
 * GET /api/v1/variables/recent-prs/{user_id}
 * @tags variables
 * @summary get recent prs of lifts
 * @param {number} user_id.path.required - the user_id - application/x-www-form-urlencoded
 */
variables.get(
  '/recent-prs/:user_id',
  validator(VariablesValidation.getRecentPrs),
  catchAsyncErrors(VariablesController.getRecentPrs),
);

/**
 * GET /api/v1/variables/recovery/{user_id}
 * @tags variables
 * @summary get recovery tracking information
 * @param {number} user_id.path.required - the user_id - application/x-www-form-urlencoded
 */
variables.get(
  '/recovery/:user_id',
  validator(VariablesValidation.getRecovery),
  catchAsyncErrors(VariablesController.getRecovery),
);

/**
 * GET /api/v1/variables/changelogs
 * @tags variables
 * @summary get all the change logs
 * @param {number} user_id.path.required - the user_id - application/x-www-form-urlencoded
 */
variables.get('/changelogs', catchAsyncErrors(VariablesController.getChangelogs));

export default variables;
