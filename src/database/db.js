import Knex from 'knex';
import options from '../config/knexfile.js';
import logger from '../utils/logger.js';
import { attachPaginate } from 'knex-paginate';

const db = Knex(options);

// Test connection
try {
  db.raw('SELECT 1');
  logger.info('Database connection started!');
} catch (error) {
  logger.error('Database connection failed!');
  logger.error('Error:', error.message);
  process.exit(1);
}

attachPaginate();

export default db;
