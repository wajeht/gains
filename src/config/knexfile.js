import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  client: 'better-sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: path.resolve(__dirname, '..', 'database', 'sqlite', 'db.sqlite'),
  },
  pool: {
    min: 1,
    max: 3,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    idleTimeoutMillis: 600000,
    destroyTimeoutMillis: 5000,
    reapIntervalMillis: 1000,
    afterCreate: (conn, done) => {
      conn.pragma('foreign_keys = ON');
      conn.pragma('journal_mode = WAL');
      conn.pragma('synchronous = NORMAL');
      conn.pragma('cache_size = 10000');
      conn.pragma('temp_store = MEMORY');
      conn.pragma('busy_timeout = 5000');
      done();
    },
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.resolve(__dirname, '..', 'database', 'migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname, '..', 'database', 'seeds'),
  },
};
