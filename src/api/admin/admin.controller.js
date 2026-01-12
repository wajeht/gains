import logger from '../../utils/logger.js';
import { StatusCodes } from 'http-status-codes';
import dayjs from 'dayjs';
import fsp from 'fs/promises';
import fs from 'fs';
import path from 'path';
import db from '../../../db/db.js';

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
    if (latest.includes('-')) {
      const negative = parseInt(latest);
      log = log.slice(negative);
    } else {
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
    data: [{ users, videos }],
  });
}

export async function getRefreshIndex(req, res) {
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

  const createPromises = [
    db.schema.raw(
      'CREATE INDEX IF NOT EXISTS sessions_id_user_id_deleted_end_date_idx ON sessions (id, user_id, deleted, end_date)',
    ),
    db.schema.raw(
      'CREATE INDEX IF NOT EXISTS videos_id_user_id_log_id_session_id_deleted_idx ON videos (id, user_id, log_id, session_id, deleted)',
    ),
    db.schema.raw(
      'CREATE INDEX IF NOT EXISTS logs_id_user_id_session_id_exercise_id_deleted_private_idx ON logs (id, user_id, session_id, exercise_id, deleted, private)',
    ),
    db.schema.raw(
      'CREATE INDEX IF NOT EXISTS sets_id_user_id_session_id_exercise_id_deleted_idx ON sets (id, user_id, session_id, exercise_id, deleted)',
    ),
    db.schema.raw(
      'CREATE INDEX IF NOT EXISTS variables_id_user_id_session_id_idx ON variables (id, user_id, session_id)',
    ),
  ];

  await Promise.allSettled(createPromises);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [],
  });
}
