import rateLimit from 'express-rate-limit';
import { skipOnMyIp } from '../app/app.routes.js';

export const regularLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300,
  statusCode: 429,
  message: {
    status: 'fail',
    request_url: async (request, _response) => request.originalUr,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOnMyIp,
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300,
  statusCode: 429,
  message: {
    status: 'fail',
    request_url: async (request, _response) => request.originalUr,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOnMyIp,
});
