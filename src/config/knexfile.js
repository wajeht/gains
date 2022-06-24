import { database } from '../config/env.js';

export default {
  client: database.client,
  // debug: true,
  // connection: database.url,
  connection: {
    host: database.host,
    database: database.database,
    user: database.username,
    password: database.password,
  },
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
