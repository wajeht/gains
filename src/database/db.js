import Knex from 'knex';
import options from '../config/knexfile.js';
import logger from '../utils/logger.js';
import { attachPaginate } from 'knex-paginate';
import { cli } from '../utils/helpers.js';

// Retry configuration
const MAX_RETRIES = 10;
const INITIAL_DELAY = 1000; // 1 second
const MAX_DELAY = 30000; // 30 seconds

async function waitForDatabase() {
  const db = Knex(options);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await db.raw('SELECT 1 + 1');
      if (!cli()) {
        logger.info('Database connection started!');
      }
      return db;
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        logger.error('Database connection failed after maximum retries!');
        logger.error('Error:', error.message);
        process.exit(1);
      }

      const delay = Math.min(INITIAL_DELAY * Math.pow(2, attempt - 1), MAX_DELAY);
      logger.warn(`Database connection attempt ${attempt} failed. Retrying in ${delay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Initialize database connection with retry
const db = await waitForDatabase();

attachPaginate();

export default db;
