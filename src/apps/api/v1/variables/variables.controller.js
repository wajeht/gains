import * as VariablesQueries from './variables.queries.js';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import { calculateE1RM } from '../../../../utils/helpers.js';
import redis from '../../../../utils/redis.js';
import axios from 'axios';

export async function getBodyweight(req, res) {
  const { user_id } = req.params;

  const { perPage, currentPage } = req.query;

  const pagination = {
    perPage: perPage ?? null,
    currentPage: currentPage ?? null,
  };

  const bodyweight = await VariablesQueries.getAllBodyweightOfAUser(user_id, pagination);
  res.json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: bodyweight.data,
    pagination: bodyweight.pagination,
  });
}

export async function getOpenPowerliftingResult(req, res) {
  const q = req.query.q;

  const index = await axios
    .get(`https://www.openpowerlifting.org/api/search/rankings?q=${q}&start=0`)
    .then((result) => result.data.next_index)
    .then((err) => err);

  if (index === null) {
    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      data: [],
    });
  }

  const data = await axios
    .get(
      `https://www.openpowerlifting.org/api/rankings?start=${index}&end=${
        index + 100
      }&lang=en&units=lbs`,
    )
    .then((result) => result.data.rows)
    .then((err) => err);

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data,
  });
}

/**
 * It gets the recovery data for a user
 * @param req - The request object.
 * @param res - The response object.
 * @returns The recovery data for a user.
 */
export async function getRecovery(req, res) {
  const { user_id } = req.params;
  const { perPage, currentPage } = req.query;

  const pagination = {
    perPage: perPage ?? null,
    currentPage: currentPage ?? null,
  };

  let recovery = JSON.parse(await redis.get(`user-id-${user_id}-recovery`));

  if (recovery === null) {
    recovery = await VariablesQueries.getRecovery(user_id, pagination);
    const setRecovery = await redis.set(
      `user-id-${user_id}-recovery`,
      JSON.stringify(recovery),
      'EX',
      24 * 60 * 60,
    );
  }

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: recovery.data,
    pagination: recovery.pagination,
  });
}

/**
 * It reads the `CHANGELOG.md` file and returns the content in HTML format
 * @param req - The request object.
 * @param res - The response object.
 * @returns The changelogs in HTML format.
 */
export async function getChangelogs(req, res) {
  let changelogs = null;
  try {
    changelogs = await fs.readFile(path.resolve(path.join(process.cwd(), 'CHANGELOG.md')), 'utf-8');
  } catch (e) {
    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      changelogs: null,
    });
  }

  const user_id = req.user.user_id;
  let changeLogsInHTMLFormat = JSON.parse(await redis.get(`user-id-${user_id}-changelogs`));

  if (changeLogsInHTMLFormat === null) {
    changeLogsInHTMLFormat = marked.parse(changelogs);

    const cache = await redis.set(
      `user-id-${user_id}-changelogs`,
      JSON.stringify(changeLogsInHTMLFormat),
      'EX',
      24 * 60 * 60,
    );
  }

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    changelogs: changeLogsInHTMLFormat,
  });
}

/**
 * We're getting the weekly body weight in for a user and then mapping the data to include a trend
 * value
 * @param req - The request object.
 * @param res - The response object.
 * @returns The weekly weight in for a user.
 */
export async function getWeeklyWeightIn(req, res) {
  const { user_id } = req.params;
  const bodyWeight = await VariablesQueries.weeklyWeightInByUserId(user_id);

  if (!bodyWeight.length) {
    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      data: bodyWeight,
    });
  }

  const mapped = [];

  // It's iteration through the bodyWeight array and calculating the trend.
  for (let i = 0; i < bodyWeight.length; i++) {
    const current = bodyWeight[i];
    const previous = bodyWeight[i + 1];

    if (previous) {
      const trend = current.body_weight - previous.body_weight;
      mapped.push({
        trend,
        ...bodyWeight[i],
      });
    }
  }

  // last element was left out so we manually push it back
  mapped.push({
    ...bodyWeight[bodyWeight.length - 1],
    trend: 0,
  });

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: mapped,
  });
}

/**
 * It returns the most recent pull requests for a given user
 * @param req - The request object.
 * @param res - The response object.
 * @returns The recent pull requests for a user.
 */
export async function getRecentPrs(req, res) {
  const { user_id } = req.params;

  // check inside cache
  let result = JSON.parse(await redis.get(`user-id-${user_id}-recent-prs`));

  if (result === null) {
    result = await VariablesQueries.recentPrsByUserId(user_id);
    let mapped = [];

    for (let i = 0; i < result.length; i++) {
      const current = result[i];
      mapped.push({
        ...current,
        e1rm: calculateE1RM(current.weight, current.rpe, current.reps),
      });
    }

    result = mapped;

    await redis.set(`user-id-${user_id}-recent-prs`, JSON.stringify(result), 'EX', 24 * 60 * 60);
  }

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: result,
  });
}
