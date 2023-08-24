#!/usr/bin/env node

import app from '../apps/app.js';
import { port, env, vue_port } from '../config/env.js';
import logger from '../utils/logger.js';
import path from 'path';
import db from '../database/db.js';
import Chad from '../utils/chad.js';
import pkg from '../utils/pkg.js';
import EmailService from '../services/email.service.js';
import latestChangelog from '../utils/latest-changelog.js';
import CronsServices from '../services/cron.services.js';
import redis from '../utils/redis.js';

app.listen(port, () => {
  logger.warn(`Server is on ${env} mode!`);
  logger.info(`Server is running on http://localhost:${port}!`);
  if (process.env.HMR === 'true') logger.warn(`But use http://localhost:${vue_port} for hmr!`);
});

async function gracefulShutdown() {
  logger.info('**** Received kill signal, shutting down gracefully. ****');

  try {
    await new Promise((resolve, reject) => {
      server.close(async (err) => {
        await redis.del('onlineUsers');
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });

    await redis.del('onlineUsers');
    await redis.disconnect();
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

    if (!upgrade[1].length) logger.warn('Database upgrade not required'); // prettier-ignore

    if (upgrade[1].length) {
      const list = upgrade[1].map((cur) => cur.split('_')[1].split('.')[0]).join(', ');

      logger.warn(`Database upgrades completed for ${list} schema`);
    }
  } catch (e) {
    logger.error(e);
    Chad.flex(e.message, e.stack);
  }
})();

// ------------------------------ auto create indexes ------------------------------
// (async () => {
//   try {
//     const { rows } = await db.raw(`
//       create index on sessions(id, user_id, deleted, end_date);
//       create index on videos(id, user_id, log_id, session_id, deleted);
//       create index on logs(id, user_id, session_id, exercise_id, deleted, private);
//       create index on sets(id, user_id, session_id, exercise_id, deleted);
//       analyze;
//     `);
//   } catch (e) {
//     logger.error(e);
//     Chad.flex(e.message, e.stack);
//   }
// })();

// ------------------------------ send changelog subscription (production only)  ------------------------------
(async () => {
  try {
    if (env === 'dev' || env === 'development') {
      logger.warn(`Skipping auto changelog email service!`);
      return;
    }

    const changelogSubscriptions = await db
      .select('s.email as email', 'u.username as username', 's.object_id as subscribed_version')
      .from('subscriptions as s')
      .innerJoin('users as u', 'u.id', 's.user_id')
      .where({ 's.deleted': false })
      .andWhere({ 's.object': 'changelog' });

    await redis.del('changelogs');

    for (const user of changelogSubscriptions) {
      // not triple equals ==== because of string type
      if (pkg.version > user.subscribed_version) {
        await EmailService.send({
          to: user.email,
          subject: `Gains v${pkg.version}`,
          template: 'new-changelog',
          data: {
            username: user.email,
            changelog: await latestChangelog(),
          },
        });
        logger.info(`Changelog email was sent to email: ${user.email}`);
      }
    }

    await db
      .update({ object_id: pkg.version })
      .from('subscriptions')
      .where({ deleted: false })
      .andWhere({ object: 'changelog' });
  } catch (e) {
    logger.error(e);
    Chad.flex(e.message, e.stack);
  }
})();

// ------------------------------ crons ------------------------------
CronsServices.start();
