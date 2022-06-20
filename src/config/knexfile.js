export default {
  client: 'pg',
  debug: true,
  // connection: database.url,
  connection: {
    host: 'localhost',
    database: 'gains',
    user: 'node_user',
    password: 'node_password',
  },
  pool: {
    min: 2,
    max: 10,
  },
  acquireConnectionTimeout: 3000,
  migrations: {
    tableName: 'knex_migrations',
    directory: '../db/migrations',
  },
  seeds: {
    directory: '../db/seeds',
  },
};
