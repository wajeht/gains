import catchAsyncError from '../middlewares/catch-async-errors.middleware.js';
import validator from '../middlewares/validator.middleware.js';

import * as AdminController from './admin.controller.js';
import * as AdminValidation from './admin.validation.js';

import express from 'express';
const admin = express.Router();

admin.get('/view-logs', catchAsyncError(AdminController.getViewLogs));

export default admin;
