import express from 'express';
import v1 from './v1/v1.js';
import authRouter from './auth/auth.router.js';

const api = express.Router();

api.use('/v1', v1);
api.use('/auth', authRouter);

export default api;
