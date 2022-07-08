import { validator, catchAsyncErrors } from '../api.middlewares.js';

import * as AdminController from './admin.controller.js';
import * as AdminValidation from './admin.validation.js';

import express from 'express';
const admin = express.Router();

admin.get('/view-logs', catchAsyncErrors(AdminController.getViewLogs));

export default admin;
