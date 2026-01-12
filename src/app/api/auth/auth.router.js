import express from 'express';
import * as AuthController from './auth.controller.js';
import { catchAsyncErrors } from '../api.middlewares.js';

const auth = express.Router();

/**
 * GET /api/auth/logout
 * @tags auth
 * @summary log out of the application
 */
auth.get('/logout', AuthController.getLogout);

/**
 * GET /api/auth/google
 * @tags auth
 * @summary initiate Google OAuth login
 */
auth.get('/google', AuthController.getGoogleOAuth);

/**
 * GET /api/auth/google/redirect
 * @tags auth
 * @summary handle Google OAuth callback
 */
auth.get('/google/redirect', catchAsyncErrors(AuthController.getGoogleOAuthRedirect));

export default auth;
