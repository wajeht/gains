import express from 'express';
const auth = express.Router();

import * as AuthController from './auth.controller.js';

auth.post('/login', AuthController.postLogin);
auth.get('/logout', AuthController.getLogout);
auth.post('/signup', AuthController.postSignup);

export default auth;
