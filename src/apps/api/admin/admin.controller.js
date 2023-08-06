import logger from '../../../utils/logger.js';
import * as UsersQueries from '../v1/users/users.queries.js';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../api.errors.js';
import seedMockTrainingData from '../../../utils/seed-mock-training-data.js';
import dayjs from 'dayjs';
import fsp from 'fs/promises';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { GITHUB } from '../../../config/env.js';
import redis from '../../../utils/redis.js';

const TODAY = dayjs().format('YYYY-MM-DD');

export async function getViewLogs(req, res) {
  const { download, latest } = req.query;

  const todaysLogName = `${TODAY}.log`;
  const todaysLogPath = path.resolve(path.join(process.cwd(), 'logs', todaysLogName));

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

/**
 * It takes in a user's email address, generates mock training data for that user, and returns a
 * success message
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postSeedMockTrainingData(req, res) {
  const { email } = req.body;

  const mock = await seedMockTrainingData(email);

  const [{ id: user_id }] = await UsersQueries.findUserByParam({ email });

  logger.info(`User ID: ${user_id} has generated mock training data!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [],
  });
}

/**
 * It makes a request to the GitHub API to get all the issues for the gains repository, and then
 * returns the response to the client
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getIssues(req, res) {
  const issues = await axios.get(GITHUB.issue_url, {
    headers: {
      Authorization: `Bearer ${GITHUB.api_key}`,
    },
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: issues.data,
  });
}

/**
 * It gets the number of online users from Redis and returns it to the client
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getOnlineUsers(req, res) {
  let users = JSON.parse(await redis.get('onlineUsers')) || [];
  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: users,
  });
}
