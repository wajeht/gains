import express from 'express';
import v1 from './v1/v1.js';

import authRouter from './auth/auth.router.js';
import contactRouter from './contact/contact.router.js';

import auth from '../api/middlewares/auth.middleware.js';

const api = express.Router();

// regular api routes
api.use('/contact', contactRouter);
api.use('/auth', authRouter);

// routes with version
api.use('/v1', auth, v1);

export default api;
