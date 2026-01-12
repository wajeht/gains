import { catchAsyncErrors } from '../api.middlewares.js';

import * as AdminController from './admin.controller.js';

import express from 'express';
const admin = express.Router();

admin.get('/stats', catchAsyncErrors(AdminController.getStats));

admin.get('/refresh-index', catchAsyncErrors(AdminController.getRefreshIndex));

export default admin;
