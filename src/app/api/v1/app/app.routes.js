import { catchAsyncErrors } from '../../api.middlewares.js';
import * as AppController from './app.controller.js';

import express from 'express';
const app = express.Router();

/**
 * GET /api/v1/app/issues
 * @tags app
 * @summary get all the githubn issues
 */
app.get('/issues', catchAsyncErrors(AppController.getIssues));

export default app;
