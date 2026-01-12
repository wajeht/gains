import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { root } from '../utils/directory.js';
import logger from '../utils/logger.js';

fs.access(path.join(root, '.env'), (err) => {
  if (err) {
    logger.error('No .env file found!');
  }
});

dotenv.config({ path: path.join(root, '.env') });

export const cookie = {
  secret: process.env.APP_COOKIE_SECRET,
  expiration: process.env.APP_COOKIE_EXPIRATION,
};

export const port = process.env.APP_PORT;

export const vue_port = process.env.APP_VUE_PORT;

export const env = process.env.APP_ENV;

export const domain = process.env.APP_DOMAIN;

export const jwt_secret = process.env.APP_JWT_SECRET;

export const email = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  auth_email: process.env.EMAIL_AUTH_EMAIL,
  auth_pass: process.env.EMAIL_AUTH_PASS,
  from: process.env.EMAIL_FROM,
};

export const admin = {
  email: process.env.APP_ADMIN_EMAIL,
};

export const google = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUrl: process.env.GOOGLE_OAUTH_REDIRECT_URL,
};
