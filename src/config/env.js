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
  secret: process.env.COOKIE_SECRET,
  expiration: process.env.COOKIE_EXPIRATION,
};

export const port = process.env.PORT;

export const vue_port = process.env.VUE_PORT;

export const env = process.env.ENV;

export const domain = process.env.DOMAIN;

export const jwt_secret = process.env.JWT_SECRET;

export const salt = parseInt(process.env.PASSWORD_SALT);

export const email = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  auth_email: process.env.EMAIL_AUTH_EMAIL,
  auth_pass: process.env.EMAIL_AUTH_PASS,
};

export const admin = {
  email: process.env.ADMIN_EMAIL,
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
};

export const GITHUB = {
  api_key: process.env.GITHUB_API_KEY,
  issue_url: process.env.GITHUB_ISSUE_URL,
};

export const MY_IP = process.env.MY_IP;

export const notify = {
  url: process.env.NOTIFY_URL,
  xApiKey: process.env.NOTIFY_X_API_KEY,
};

export const google = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUrl: process.env.GOOGLE_OAUTH_REDIRECT_URL,
};
