import { StatusCodes } from 'http-status-codes';
import path from 'path';
import { env } from '../config/env.js';
import Chad from '../libs/chad.js';
import logger from '../libs/logger.js';
import { red } from '../utils/rainbow-log.js';
import requestIp from 'request-ip';

/**
 * It returns a 200 status code with a JSON object containing a message
 * @param req - The request object.
 * @param res - The response object.
 */
export function getHealthCheck(req, res) {
  const ip = requestIp.getClientIp(req);
  Chad.flex(`someone hit a health check from ${ip}`);
  res.status(200).json({
    msg: 'ok',
  });
}

/**
 * It sends the index.html file to the browser
 * @param req - The request object.
 * @param res - The response object.
 * @returns The index.html file from the public folder.
 */
export function vueHandler(req, res, next) {
  try {
    res.sendFile(path.resolve(path.join(process.cwd(), 'src', 'public', 'index.html'))); // prettier-ignore
  } catch (error) {
    next(error);
  }
}

/**
 *
 * If the requested resource does not exist, send a 404 status code and a JSON response with a status
 * of 'fail' and a message of 'The resource does not exist!'
 * @param req - The request object.
 * @param res - The response object.
 * @param next - This is a callback function that will be called when the middleware is complete.
 */
export function notFoundHandler(req, res, next) {
  res.status(StatusCodes.NOT_FOUND).json({
    status: 'fail',
    request_url: req.originalUrl,
    message: 'The resource does not exist!',
  });
}

/**
 * If an error occurs, log it, send a 500 status code, and send a message to the client
 * @param err - The error object
 * @param req - The request object.
 * @param res - The response object.
 * @param next - This is a function that will be called when the middleware is done.
 */
export function errorHandler(err, req, res, next) {
  // api errors
  if (err.name === 'CustomAPIError') {
    return res.status(err.statusCode).json({
      status: 'fail',
      request_url: req.originalUrl,
      errors: err?.errors,
      message: env === 'development' ? err.stack : err.message,
    });
  }

  // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ip = requestIp.getClientIp(req);
  const errWithIP = {
    ...err,
    ip,
  };
  logger.error(errWithIP);
  Chad.flex(`${ip}:${err.msg}`, err.stack);

  // other errors
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'fail',
    request_url: req.originalUrl,
    errors: err?.errors,
    message:
      env === 'development'
        ? err.stack
        : 'The server encountered an internal error or misconfiguration and was unable to complete your request.',
  });
}
