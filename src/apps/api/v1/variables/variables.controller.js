import * as VariablesQueries from './variables.queries.js';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import { calculateE1RM } from '../../../../utils/helpers.js';

export async function getRecovery(req, res) {
  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [],
  });
}

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

  const changeLogsInHTMLFormat = marked.parse(changelogs);

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
  // It's looping through the bodyWeight array and calculating the trend.
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
  const result = await VariablesQueries.recentPrsByUserId(user_id);

  const mapped = [];

  for (let i = 0; i < result.length; i++) {
    const current = result[i];
    mapped.push({
      ...current,
      e1rm: calculateE1RM(current.weight, current.rpe, current.reps),
    });
  }

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: mapped,
  });
}
