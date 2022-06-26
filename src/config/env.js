import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { red } from '../utils/rainbow-log.js';
import { root } from '../utils/directory.js';

/* Checking if the .env file exists. If it doesn't, it will throw an error. */
fs.access(path.join(root, '.env'), (err) => {
  if (err) {
    red('No .env file found!');
    process.exit(1);
  }
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

/* Exporting the environment variable `ENV` from the .env file. */
export const env = process.env.ENV;

/* This is the secret that will be used to sign the JWT. */
export const jwt_secret = process.env.JWT_SECRET;

/* This is the salt that will be used to hash the password. */
export const salt = parseInt(process.env.PASSWORD_SALT);

/* This is the object that will be used to send emails. */
export const email = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  auth_user: process.env.EMAIL_AUTH_USER,
  auth_pass: process.env.EMAIL_AUTH_PASS,
};

/* Exporting the discord id and token from the .env file. */
export const discord = {
  id: process.env.DISCORD_ID,
  token: process.env.DISCORD_TOKEN,
  url: process.env.DISCORD_URL,
};
