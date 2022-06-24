import express from 'express';
const api = express.Router();

import v1 from './v1/v1.js';
import authRouter from './auth/auth.router.js';

api.use('/v1', v1);
api.use('/auth', authRouter);

export default api;
