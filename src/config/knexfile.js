import logger from '../utils/logger.js';
import { database, env } from './env.js';
import { cli } from '../utils/helpers.js';

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

  if (!cli) {
    logger.warn('Not using database connection string!');
  }
}

export default {
  client: database.client,
  // debug: env === 'development', // only in dev
  connection,
  ping: function (connection, callback) {
    connection.query({ sql: 'SELECT 1 = 1' }, [], callback);
  },
  pingTimeout: 3 * 1000,
  pool: {
    min: 0,
    max: 5,
    acquireTimeoutMillis: 60000,
    idleTimeoutMillis: 600000,
  },
  acquireConnectionTimeout: 5000,
  migrations: {
    tableName: 'knex_migrations',
    directory: '../database/migrations',
  },
  seeds: {
    directory: '../database/seeds',
  },
};
