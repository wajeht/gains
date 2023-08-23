import rateLimit from 'express-rate-limit';

export const regularLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300,
  statusCode: 429,
  message: {
    status: 'fail',
    request_url: async (request, response) => request.originalUr,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300,
  statusCode: 429,
  message: {
    status: 'fail',
    request_url: async (request, response) => request.originalUr,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
