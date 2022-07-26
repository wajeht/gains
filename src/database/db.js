import Knex from 'knex';
import options from '../config/knexfile.js';
import logger from '../libs/logger.js';
import { yellow, red } from '../utils/rainbow-log.js';
import { attachPaginate } from 'knex-paginate';

Knex(options)
  .raw('SELECT 1 + 1')
  .then((res) => {
    const msg = 'Database connection started!';
    logger.info(msg);
  })
  .catch((err) => {
    logger.error('Database connection failed!');
    process.exit(1);
  });

const db = Knex(options);
attachPaginate();

export default db;
