import Knex from 'knex';
import options from '../config/knexfile.js';
import logger from '../libs/logger.js';
import { yellow, red } from '../utils/rainbow-log.js';

Knex(options)
  .raw('SELECT 1 + 1')
  .then((res) => {
    const msg = 'Database connection started!';
    logger.info(msg);
    // yellow(msg);
  })
  .catch((err) => {
    // red('Database connection failed!');
    logger.error('Database connection failed!');
    process.exit(1);
  });

export default Knex(options);
