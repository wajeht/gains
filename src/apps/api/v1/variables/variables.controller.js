import * as VariablesQueries from './variables.queries.js';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import { calculateE1RM } from '../../../../utils/helpers.js';
import redis from '../../../../utils/redis.js';
import axios from 'axios';
import logger from '../../../../utils/logger.js';

/**
 * It deletes a variable from the database
 * @param req - The request object.
 * @param res - The response object.
 * @returns a status code of 200 and a json object with a status, request_url, message, and data.
 */
export async function deleteAVariable(req, res) {
  const { user_id } = req.query;
  const { variable_id } = req.params;

  const variables = await VariablesQueries.deleteAVariable(variable_id, user_id);

  logger.info(`User id: ${user_id} has deleted variables ${variable_id}!`);

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: variables,
  });
}

/**
 * It creates a variable and returns the created variable
 * @param req - The request object.
 * @param res - The response object.
 * @returns a response with a status code of 201 and a message.
 */
export async function postAVariable(req, res) {
  const body = req.body;

  const variables = await VariablesQueries.createAVariable(body);

  logger.info(`User id: ${body.user_id} has created variables ${JSON.stringify(body)}!`);

  return res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: variables,
  });
}

/**
 * It gets all the bodyweight of a user
 * @param req - The request object.
 * @param res - The response object.
 * @returns The bodyweight of a user.
 */
export async function getBodyweight(req, res) {
  const { user_id } = req.params;

  const { perPage, currentPage } = req.query;

  const pagination = {
    perPage: perPage ?? null,
    currentPage: currentPage ?? null,
  };

  const bodyweight = await VariablesQueries.getAllBodyweightOfAUser(user_id, pagination);
  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: bodyweight.data,
    pagination: bodyweight.pagination,
  });
}

export async function getCalories(req, res) {
  const { user_id } = req.params;

  const { perPage, currentPage } = req.query;

  const pagination = {
    perPage: perPage ?? null,
    currentPage: currentPage ?? null,
  };

  const calories = await VariablesQueries.getAllCaloriesOfAUser(user_id, pagination);
  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: calories.data,
    pagination: calories.pagination,
  });
}

/**
 * It takes a query parameter, q, and returns the first 100 results from the OpenPowerlifting API
 * @param req - The request object.
 * @param res - The response object.
 * @returns The data is being returned as an array of objects.
 */
export async function getOpenPowerliftingResult(req, res) {
  const q = req.query.q;

  const api = axios.create({
    baseURL: process.env.CLOSE_POWERLIFTING_API_URI,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLOSE_POWERLIFTING_API_KEY,
    },
  });

  const data = await (await api.get(`/api/users?search=${q}`)).data;

  return res.status(StatusCodes.OK).json(data);
}

/**
 * It gets the recovery data for a user
 * @param req - The request object.
 * @param res - The response object.
 * @returns The recovery data for a user.
 */
export async function getRecovery(req, res) {
  const { user_id } = req.params;
  const { perPage, currentPage, cache } = req.query;

  const pagination = {
    perPage: perPage ?? null,
    currentPage: currentPage ?? null,
  };

  if (cache == false) {
    const recovery = await VariablesQueries.getRecovery(user_id, pagination);
    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      cache: cache,
      data: recovery.data,
      pagination: recovery.pagination,
    });
  }

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
    cache: cache,
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
  let changeLogsInHTMLFormat = JSON.parse(await redis.get('changelogs'));

  if (!changeLogsInHTMLFormat) {
    try {
      const changelogs = await fs.readFile(
        path.resolve(path.join(process.cwd(), 'CHANGELOG.md')),
        'utf-8',
      );

      const versions = changelogs.match(/###.*\([0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]\)\n/g);
      const parsedChangelogs = changelogs
        .split(/###.*\([0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]\)\n/g)
        .slice(1);

      changeLogsInHTMLFormat = parsedChangelogs.map((cl, idx) => {
        let ver = versions[idx];
        ver = ver.slice(0, 3) + ' Versions' + ver.slice(3);
        return {
          version: marked.parse(ver),
          current: idx === 0,
          changelog: marked.parse(cl),
        };
      });

      await redis.set('changelogs', JSON.stringify(changeLogsInHTMLFormat));
    } catch (e) {
      return res.status(StatusCodes.OK).json({
        status: 'success',
        request_url: req.originalUrl,
        message: 'The resource was returned successfully!',
        changelogs: null,
      });
    }
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

  let result = JSON.parse(await redis.get(`user-id-${user_id}-weekly-weight-in`));

  if (result === null) {
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

    result = mapped;

    await redis.set(
      `user-id-${user_id}-weekly-weight-in`,
      JSON.stringify(result),
      'EX',
      24 * 60 * 60,
    );
  }

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: result,
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
