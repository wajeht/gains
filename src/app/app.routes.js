import { StatusCodes } from 'http-status-codes';
import path from 'path';
import { env } from '../config/env.js';
import Chad from '../utils/chad.js';
import logger from '../utils/logger.js';
import requestIp from 'request-ip';

export function skipOnMyIp(req, _res) {
  console.log(`my ip was connected: ${req.ip}`);
  return req.ip === MY_IP && env === 'production';
}

export function getHealthCheck(req, res) {
  const ip = requestIp.getClientIp(req);
  if (ip != MY_IP) {
    Chad.flex(`someone hit a health check from ${ip}`);
  }
  res.status(200).json({
    msg: 'ok',
  });
}

export function vueHandler(req, res, next) {
  try {
    const vue = path.resolve(path.join(process.cwd(), 'src', 'public', 'index.html'));
    res.setHeader('Content-Type', 'text/html');
    return res.status(StatusCodes.OK).sendFile(vue);
  } catch (e) {
    next(e);
  }
}

export function notFoundHandler(req, res, _next) {
  res.status(StatusCodes.NOT_FOUND).json({
    status: 'fail',
    request_url: req.originalUrl,
    message: 'The resource does not exist!',
    data: [],
  });
}

export function errorHandler(err, req, res, _next) {
  // api errors
  if (err.name === 'CustomAPIError') {
    return res.status(err.statusCode).json({
      status: 'fail',
      request_url: req.originalUrl,
      errors: err?.errors,
      message: env === 'development' ? err.stack : err.message,
      cache: req.query.cache,
      data: [],
    });
  }

  const ip = requestIp.getClientIp(req);

  const errWithIP = {
    ...err,
    ip,
  };

  logger.error(errWithIP);

  Chad.flex(`${ip}:${err.msg}`, err.stack);

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'fail',
    request_url: req.originalUrl,
    errors: err?.errors,
    message:
      env === 'development'
        ? err.stack
        : 'The server encountered an internal error or misconfiguration and was unable to complete your request.',
    cache: req.query.cache,
    data: [],
  });
}
