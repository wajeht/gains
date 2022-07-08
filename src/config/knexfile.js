import logger from '../libs/logger.js';
import { database, env } from './env.js';

let connection = null;

// use connecting string if not user local
if (
  (!database.host || !database.database || !database.username || !database.password) &&
  env === 'production'
) {
  connection = database.url;
  logger.warn('Using database connection string!');
} else {
  connection = {
    host: database.host,
    database: database.database,
    user: database.username,
    password: database.password,
  };
  logger.warn('Not using database connection string!');
}

export default {
  client: database.client,
  // debug: env === 'development', // only in dev
  connection,
  pool: {
    min: 2,
    max: 10,
  },
  acquireConnectionTimeout: 3000,
  migrations: {
    tableName: 'knex_migrations',
    directory: '../database/migrations',
  },
  seeds: {
    directory: '../database/seeds',
  },
};
