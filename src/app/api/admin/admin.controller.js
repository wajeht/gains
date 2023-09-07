import logger from '../../../utils/logger.js';
import * as UsersQueries from '../v1/users/users.queries.js';
import { StatusCodes } from 'http-status-codes';
import seedMockTrainingData from '../../../utils/seed-mock-training-data.js';
import dayjs from 'dayjs';
import fsp from 'fs/promises';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { GITHUB } from '../../../config/env.js';
import redis from '../../../utils/redis.js';
import db from '../../../database/db.js';

const TODAY = dayjs().format('YYYY-MM-DD');

export async function getViewLogs(req, res) {
  const { download, latest } = req.query;

  const todaysLogName = `${TODAY}.log`;
  const todaysLogPath = path.resolve(
    path.join(process.cwd(), 'src', 'storage', 'logs', todaysLogName),
  );

  let log = null;

  if (!fs.existsSync(todaysLogPath)) {
    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      data: [],
    });
  }

  if (download) {
    return res.status(StatusCodes.OK).download(todaysLogPath);
  }

  log = await fsp.readFile(todaysLogPath, 'utf-8');
  log = log.split('\n');

  if (latest) {
    // grabbing the latest from the back
    if (latest.includes('-')) {
      const negative = parseInt(latest);
      log = log.slice(negative);
    }

    // grabbing the oldest from the beginning
    else {
      log = log.slice(0, latest);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      data: log,
    });
  }

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: log,
  });
}

export async function postSeedMockTrainingData(req, res) {
  const { email } = req.body;

  seedMockTrainingData(email);

  const [{ id: user_id }] = await UsersQueries.findUserByParam({ email });

  logger.info(`User ID: ${user_id} has generated mock training data!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [],
  });
}

export async function getIssues(req, res) {
  let issues = JSON.parse(await redis.get('issues'));

  if (issues === null) {
    issues = await axios.get(GITHUB.issue_url, {
      headers: {
        Authorization: `Bearer ${GITHUB.api_key}`,
      },
    });
    await redis.set('issues', JSON.stringify(issues.data), 'EX', 24 * 60 * 60);
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: issues,
  });
}

export async function getOnlineUsers(req, res) {
  let users = JSON.parse(await redis.get('onlineUsers')) || [];
  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: users,
  });
}

export async function clearAllCache(req, res) {
  await redis.flushall();

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [],
  });
}

export async function getStats(req, res) {
  const today = dayjs().endOf('day').toISOString();
  const sevenDaysAgo = dayjs().subtract(7, 'day').startOf('day').toISOString();

  const users = await db
    .select('id')
    .from('users')
    .whereBetween('users.created_at', [sevenDaysAgo, today]);

  const videos = await db
    .select('id')
    .from('videos')
    .whereBetween('videos.created_at', [sevenDaysAgo, today]);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [
      {
        users,
        videos,
      },
    ],
  });
}

export async function getRefreshIndex(req, res) {
  await db.transaction(async (trx) => {
    // Fetch index names from pg_indexes
    const indexInfo = await db.select('indexname').from('pg_indexes').whereNot('tablename', 'pg%');

    // Drop all the fetched indexes in parallel
    const dropIndexPromises = indexInfo.map(({ indexname }) => {
      return db.raw(`DROP INDEX ${indexname}`).transacting(trx);
    });

    await Promise.allSettled(dropIndexPromises);

    // Drop existing indexes
    const dropPromises = [
      db.schema.raw('DROP INDEX IF EXISTS sessions_id_user_id_deleted_end_date_idx'),
      db.schema.raw('DROP INDEX IF EXISTS videos_id_user_id_log_id_session_id_deleted_idx'),
      db.schema.raw(
        'DROP INDEX IF EXISTS logs_id_user_id_session_id_exercise_id_deleted_private_idx',
      ),
      db.schema.raw('DROP INDEX IF EXISTS sets_id_user_id_session_id_exercise_id_deleted_idx'),
      db.schema.raw('DROP INDEX IF EXISTS variables_id_user_id_session_id_idx'),
    ];

    await Promise.allSettled(dropPromises);

    // Create new indexes
    const createPromises = [
      db.schema.raw('CREATE INDEX ON sessions (id, user_id, deleted, end_date)'),
      db.schema.raw('CREATE INDEX ON videos (id, user_id, log_id, session_id, deleted)'),
      db.schema.raw(
        'CREATE INDEX ON logs (id, user_id, session_id, exercise_id, deleted, private)',
      ),
      db.schema.raw('CREATE INDEX ON sets (id, user_id, session_id, exercise_id, deleted)'),
      db.schema.raw('CREATE INDEX ON variables (id, user_id, session_id)'),
    ];

    await Promise.allSettled(createPromises);
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [],
  });
}
