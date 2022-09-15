import express from 'express';
import v1 from './v1/v1.routes.js';

import authRouter from './auth/auth.router.js';
import contactRouter from './contact/contact.router.js';
import adminRouter from './admin/admin.router.js';

import { authenticateUser, authorizePermissions } from './api.middlewares.js';

const api = express.Router();

// regular api routes
api.use('/contact', contactRouter);
api.use('/auth', authRouter);

// admin
api.use('/admin', authenticateUser, authorizePermissions('admin', 'api-admin-user'), adminRouter);

// routes with version
api.use('/v1', authenticateUser, v1);

// for api document as jsdocs comments
// https://brikev.github.io/express-jsdoc-swagger-docs/#/

export default api;
