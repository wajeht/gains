import { REDIS } from '../config/env.js';
import Redis from 'ioredis';
import logger from './logger.js';
import Chad from './chad.js';
import { cli } from './helpers.js';

const redisConfig = {
  port: REDIS.port,
  host: REDIS.host,
  username: REDIS.username,
  password: REDIS.password,
  db: REDIS.db,
};

let client;

try {
  client = new Redis(redisConfig);
  if (!cli()) {
    logger.info(`Redis client started`);
  }
} catch (e) {
  logger.error(e);
  Chad.flex(e.message, e.stack);
}

// client.on('error', (error) => {
//   logger.error(e);
//   Chad.flex(e.message, e.stack);
// });

// client.on('connect', (error) => {
//   logger.info(`Redis client started`);
// });

export default client;
