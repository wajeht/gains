import express from 'express';
import * as AuthController from './auth.controller.js';
import { catchAsyncErrors } from '../api.middlewares.js';

const auth = express.Router();

auth.get('/logout', AuthController.getLogout);
auth.get('/google', AuthController.getGoogleOAuth);
auth.get('/google/redirect', catchAsyncErrors(AuthController.getGoogleOAuthRedirect));

export default auth;
