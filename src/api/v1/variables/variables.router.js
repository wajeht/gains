import { validator, catchAsyncErrors } from '../../api.middlewares.js';

import * as VariablesValidation from './variables.validation.js';
import * as VariablesController from './variables.controller.js';

import express from 'express';
const variables = express.Router();

variables.delete(
  '/:variable_id',
  validator(VariablesValidation.deleteAVariable),
  catchAsyncErrors(VariablesController.deleteAVariable),
);

variables.post(
  '/',
  validator(VariablesValidation.postAVariable),
  catchAsyncErrors(VariablesController.postAVariable),
);

variables.get(
  '/bodyweight/:user_id',
  validator(VariablesValidation.getBodyweight),
  catchAsyncErrors(VariablesController.getBodyweight),
);

variables.get(
  '/calories/:user_id',
  validator(VariablesValidation.getCalories),
  catchAsyncErrors(VariablesController.getCalories),
);

variables.get(
  '/weekly-weight-in/:user_id',
  validator(VariablesValidation.getWeeklyWeightIn),
  catchAsyncErrors(VariablesController.getWeeklyWeightIn),
);

variables.get(
  '/recent-prs/:user_id',
  validator(VariablesValidation.getRecentPrs),
  catchAsyncErrors(VariablesController.getRecentPrs),
);

variables.get(
  '/recovery/:user_id',
  validator(VariablesValidation.getRecovery),
  catchAsyncErrors(VariablesController.getRecovery),
);

export default variables;
