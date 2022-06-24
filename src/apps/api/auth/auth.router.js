import express from 'express';
import * as AuthController from './auth.controller.js';

const auth = express.Router();

auth.post('/login', AuthController.postLogin);
auth.get('/logout', AuthController.getLogout);
auth.post('/signup', AuthController.postSignup);

export default auth;
