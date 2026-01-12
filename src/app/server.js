#!/usr/bin/env node

import app from '../app/app.js';
import { port, env, vue_port } from '../config/env.js';
import logger from '../utils/logger.js';
import path from 'path';
import db from '../database/db.js';
import Chad from '../utils/chad.js';
import CronsServices from '../services/cron.services.js';

app.listen(port, () => {
  logger.warn(`Server is on ${env} mode!`);
  logger.info(`Server is running on http://localhost:${port}!`);
  if (process.env.HMR === 'true') logger.warn(`But use http://localhost:${vue_port} for hmr!`);
});

async function gracefulShutdown() {
  logger.info('**** Received kill signal, shutting down gracefully. ****');

  try {
    await db.destroy();

    logger.info('**** Closed out remaining connections. ****');
    process.exit(0);
  } catch (err) {
    logger.error('**** Error during shutdown ****', err);
    process.exit(1);
  }
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// ------------------------------ auto migrate db on start (production only) ------------------------------
(async () => {
  if (env !== 'production') {
    logger.warn(`Environment is on ${env}!`);
    logger.warn(`Skipping database auto migration!`);
    logger.warn(`Please migrate manually!`);
    return;
  }

  try {
    const config = {
      directory: path.resolve(path.join(process.cwd(), 'src', 'database', 'migrations')),
    };

    const version = await db.migrate.currentVersion();

    logger.warn(`Current database version ${version}`);

    logger.warn(`Checking for database upgrades`);

    const upgrade = await db.migrate.latest(config);

    if (!upgrade[1].length) logger.warn('Database upgrade not required');

    if (upgrade[1].length) {
      const list = upgrade[1].map((cur) => cur.split('_')[1].split('.')[0]).join(', ');

      logger.warn(`Database upgrades completed for ${list} schema`);
    }
  } catch (e) {
    logger.error(e);
    Chad.flex(e.message, e.stack);
  }
})();

// ------------------------------ crons ------------------------------
CronsServices.start();
