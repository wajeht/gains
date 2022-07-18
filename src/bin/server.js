#!/usr/bin/env node

import app from '../apps/app.js';
import { port, env, vue_port } from '../config/env.js';
import { green, red } from '../utils/rainbow-log.js';
import logger from '../libs/logger.js';
import path from 'path';
import db from '../database/db.js';

app.listen(port, () => {
  logger.warn(`Server is on ${env} mode!`);
  logger.info(`Server is running on http://localhost:${port}!`);
  if (process.env.HMR === 'true') logger.warn(`But use http://localhost:${vue_port} for hmr!`);
});

// auto migrate db on start
(async () => {
  try {
    const config = {
      directory: path.resolve(path.join(process.cwd(), 'src', 'database', 'migrations')),
    };

    const version = await db.migrate.currentVersion();

    logger.warn(`Current database version ${version}`);

    logger.warn(`Checking for database upgrades`);

    const upgrade = await db.migrate.latest(config);

    if (!upgrade[1].length) logger.warn('Database upgrade not required'); // prettier-ignore

    if (upgrade[1].length) {
      const list = upgrade[1].map((cur) => cur.split('_')[1].split('.')[0]).join(', ');

      logger.warn(`Database upgrades completed for ${list} schema`);
    }
  } catch (e) {
    logger.error(e);
  }
})();
