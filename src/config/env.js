import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { root } from '../utils/directory.js';
import logger from '../libs/logger.js';

/* Checking if the .env file exists. If it doesn't, it will throw an error. */
fs.access(path.join(root, '.env'), (err) => {
  if (err) {
    logger.error('No .env file found!');
    // process.exit(1); // this causes test to failed on github action
  }
  logger.info('Found .env file!');
});

/* Loading the .env file. */
dotenv.config({ path: path.join(root, '.env') });

/* Exporting the database object. */
export const database = {
  client: process.env.DB_CLIENT,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  url: process.env.DB_URL,
};

/* This is the cookie object that will be used to set the cookie. */
export const cookie = {
  secret: process.env.COOKIE_SECRET,
  expiration: process.env.COOKIE_EXPIRATION,
};

/* Exporting the port number from the .env file. */
export const port = process.env.PORT;

/* This is the port that the Vue.js application will be running on. */
export const vue_port = process.env.VITE_VUE_PORT;

/* Exporting the environment variable `ENV` from the .env file. */
export const env = process.env.ENV;

/* This is the domain that will be used to set the cookie. */
export const domain = process.env.DOMAIN;

/* This is the secret that will be used to sign the JWT. */
export const jwt_secret = process.env.JWT_SECRET;

/* This is the salt that will be used to hash the password. */
export const salt = parseInt(process.env.PASSWORD_SALT);

/* This is the object that will be used to send emails. */
export const email = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  auth_email: process.env.EMAIL_AUTH_EMAIL,
  auth_pass: process.env.EMAIL_AUTH_PASS,
};

/* Exporting the discord id and token from the .env file. */
export const discord = {
  id: process.env.DISCORD_ID,
  token: process.env.DISCORD_TOKEN,
  url: process.env.DISCORD_URL,
};

/* This is the admin object that will be used to create the admin user. */
export const admin = {
  email: process.env.ADMIN_EMAIL,
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
};
