import express from 'express';
import v1 from './v1/v1.js';
import authRouter from './auth/auth.router.js';

import auth from '../api/middlewares/auth.middleware.js';

const api = express.Router();

api.use('/auth', authRouter);
api.use('/v1', auth, v1);

export default api;
