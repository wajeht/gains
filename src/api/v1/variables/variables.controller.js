import * as VariablesQueries from './variables.queries.js';
import { StatusCodes } from 'http-status-codes';
import { calculateE1RM } from '../../../utils/helpers.js';
import axios from 'axios';
import logger from '../../../utils/logger.js';

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

export async function getRecovery(req, res) {
  const { user_id } = req.params;
  const { perPage, currentPage } = req.query;

  const pagination = {
    perPage: perPage ?? null,
    currentPage: currentPage ?? null,
  };

  const recovery = await VariablesQueries.getRecovery(user_id, pagination);

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: recovery.data,
    pagination: recovery.pagination,
  });
}

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

export async function getRecentPrs(req, res) {
  const { user_id } = req.params;

  const result = await VariablesQueries.recentPrsByUserId(user_id);
  const mapped = result.map((current) => ({
    ...current,
    e1rm: calculateE1RM(current.weight, current.rpe, current.reps),
  }));

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: mapped,
  });
}
