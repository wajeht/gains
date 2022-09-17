import { REDIS } from '../config/env.js';
import Redis from 'ioredis';
import logger from './logger.js';
import Chad from './chad.js';

const redisConfig = {
  port: REDIS.port,
  host: REDIS.host,
  username: REDIS.username,
  password: REDIS.password,
  db: REDIS.db,
  autoResubscribe: false,
  lazyConnect: true,
  maxRetriesPerRequest: 0,
  tls: null,
  lazyConnect: false,
  showFriendlyErrorStack: true,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

let client;

try {
  client = new Redis({});
  logger.info(`Redis client started`);
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
