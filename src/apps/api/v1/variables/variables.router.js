import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import * as VariablesValidation from './variables.validation.js';
import * as VariablesController from './variables.controller.js';

import express from 'express';
const variables = express.Router();

/**
 * DELETE /api/v1/variables/{variable_id}?user_id={user_id}
 * @tags variables
 * @summary delete a variables
 * @param {number} variable_id.path.required - the user_id  - application/x-www-form-urlencoded
 * @param {number} user_id.form - the user_id - application/x-www-form-urlencoded
 */
variables.delete(
  '/:variable_id',
  validator(VariablesValidation.deleteAVariable),
  catchAsyncErrors(VariablesController.deleteAVariable),
);

/**
 * POST /api/v1/variables
 * @tags variables
 * @summary post a variables
 * @param {number} user_id.required - the user_id  - application/x-www-form-urlencoded
 * @param {number} body_weight.form.required - the body_weight - application/x-www-form-urlencoded
 * @param {number} caffeine_intake.form - the caffeine_intake - application/x-www-form-urlencoded
 * @param {number} calories_prior_session.form - the calories_prior_session - application/x-www-form-urlencoded
 * @param {number} total_calories.form - the total_calories - application/x-www-form-urlencoded
 * @param {number} water_prior_session.form - the water_prior_session - application/x-www-form-urlencoded
 * @param {number} total_water.form - the total_water - application/x-www-form-urlencoded
 * @param {number} hours_of_sleep.form - the hours_of_sleep - application/x-www-form-urlencoded
 * @param {number} stress_level.form - the stress_level - application/x-www-form-urlencoded
 * @param {number} session_id.form - the session_id - application/x-www-form-urlencoded
 */
variables.post(
  '/',
  validator(VariablesValidation.postAVariable),
  catchAsyncErrors(VariablesController.postAVariable),
);

/**
 * GET /api/v1/variables/bodyweight/{user_id}?perPage={perPage}&currentPage={currentPage}
 * @tags variables
 * @summary get all the body of a  user
 * @param {number} user_id.path.required - the user_id  - application/x-www-form-urlencoded
 * @param {number} perPage.query.required - the perPage id  - application/x-www-form-urlencoded
 * @param {number} currentPage.query.required - the currentPage id  - application/x-www-form-urlencoded
 */
variables.get(
  '/bodyweight/:user_id',
  validator(VariablesValidation.getBodyweight),
  catchAsyncErrors(VariablesController.getBodyweight),
);

/**
 * GET /api/v1/variables/calories/{user_id}?perPage={perPage}&currentPage={currentPage}
 * @tags variables
 * @summary get all the calories of a  user
 * @param {number} user_id.path.required - the user_id  - application/x-www-form-urlencoded
 * @param {number} perPage.query.required - the perPage id  - application/x-www-form-urlencoded
 * @param {number} currentPage.query.required - the currentPage id  - application/x-www-form-urlencoded
 */
variables.get(
  '/calories/:user_id',
  validator(VariablesValidation.getCalories),
  catchAsyncErrors(VariablesController.getCalories),
);

/**
 * GET /api/v1/variables/open-powerlifting?q={q}
 * @tags variables
 * @summary search a user in open powerlifting
 * @param {number} q.query.required - the search text  - application/x-www-form-urlencoded
 */
variables.get(
  '/open-powerlifting',
  validator(VariablesValidation.getOpenPowerliftingResult),
  catchAsyncErrors(VariablesController.getOpenPowerliftingResult),
);

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
 * GET /api/v1/variables/recovery/{user_id}?perPage={perPage}&currentPage={currentPage}
 * @tags variables
 * @summary get recovery tracking information
 * @param {number} perPage.query.required - the perPage id  - application/x-www-form-urlencoded
 * @param {number} currentPage.query.required - the currentPage id  - application/x-www-form-urlencoded
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
