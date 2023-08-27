import { validator, catchAsyncErrors } from '../api.middlewares.js';

import * as AdminController from './admin.controller.js';
import * as AdminValidation from './admin.validation.js';

import express from 'express';
const admin = express.Router();

admin.get('/issues', catchAsyncErrors(AdminController.getIssues));

admin.get('/clear-all-cache', catchAsyncErrors(AdminController.clearAllCache));

admin.get(
  '/view-logs',
  validator(AdminValidation.getViewLogs),
  catchAsyncErrors(AdminController.getViewLogs),
);

admin.post(
  '/seed-mock-training-data',
  validator(AdminValidation.postSeedMockTrainingDataUser),
  catchAsyncErrors(AdminController.postSeedMockTrainingData),
);

admin.get('/online-users', catchAsyncErrors(AdminController.getOnlineUsers));

admin.get('/stats', catchAsyncErrors(AdminController.getStats));

admin.get('/refresh-index', catchAsyncErrors(AdminController.getRefreshIndex));

export default admin;
