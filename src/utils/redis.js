import { REDIS } from '../config/env.js';
import Redis from 'ioredis';
import logger from './logger.js';
import Chad from './chad.js';

const client = new Redis({
  port: REDIS.port, // Redis port
  host: REDIS.host, // Redis host
  username: REDIS.username, // needs Redis >= 6
  password: REDIS.password,
  db: REDIS.db, // Defaults to 0
});

client.on('error', (error) => {
  logger.error(e);
  Chad.flex(e.message, e.stack);
});

client.on('error', (error) => {
  logger.info(`Redis client started`);
});

export default client;
