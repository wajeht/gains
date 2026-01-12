import { Router } from 'express';
import * as YouTubeController from './youtube.controller.js';

const router = Router();

// Get auth URL - redirect user here to authorize
router.get('/auth', YouTubeController.getAuthUrl);

// OAuth callback - Google redirects here with code
router.get('/callback', YouTubeController.handleCallback);

// Check auth status
router.get('/status', YouTubeController.getStatus);

export default router;
