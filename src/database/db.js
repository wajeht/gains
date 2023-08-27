import Knex from 'knex';
import options from '../config/knexfile.js';
import logger from '../utils/logger.js';
import { attachPaginate } from 'knex-paginate';
import { cli } from '../utils/helpers.js';

Knex(options)
  .raw('SELECT 1 + 1')
  .then(() => {
    if (!cli()) {
      logger.info('Database connection started!');
    }
  })
  .catch(() => {
    logger.error('Database connection failed!');
    process.exit(1);
  });

const db = Knex(options);

attachPaginate();

export default db;
