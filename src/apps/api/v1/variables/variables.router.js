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

export default variables;
