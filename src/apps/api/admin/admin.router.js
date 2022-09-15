import { validator, catchAsyncErrors } from '../api.middlewares.js';

import * as AdminController from './admin.controller.js';
import * as AdminValidation from './admin.validation.js';

import express from 'express';
const admin = express.Router();

admin.get('/view-logs', catchAsyncErrors(AdminController.getViewLogs));

admin.post(
  '/seed-mock-training-data',
  validator(AdminValidation.postSeedMockTrainingDataUser),
  catchAsyncErrors(AdminController.postSeedMockTrainingData),
);

export default admin;
