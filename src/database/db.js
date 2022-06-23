import Knex from 'knex';
import options from '../config/knexfile.js';
import logger from '../libs/logger.js';
import { yellow, red } from '../utils/rainbow-log.js';

Knex(options)
  .raw(`SELECT 1 + 1`)
  .then((res) => {
    yellow('Database connection started!');
  })
  .catch((err) => {
    logger.error(err);
    red('Database connection failed!');
    process.exit(1);
  });

export default Knex(options);
