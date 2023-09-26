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

export const database = {
  client: process.env.DB_CLIENT,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  url: process.env.DB_URL,
};

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

export const discord = {
  id: process.env.DISCORD_ID,
  token: process.env.DISCORD_TOKEN,
  url: process.env.DISCORD_URL,
};

export const admin = {
  email: process.env.ADMIN_EMAIL,
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
};

export const REDIS = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB,
  url: process.env.REDIS_URL,
};

export const GITHUB = {
  api_key: process.env.GITHUB_API_KEY,
  issue_url: process.env.GITHUB_ISSUE_URL,
};

export const MY_IP = process.env.MY_IP;
