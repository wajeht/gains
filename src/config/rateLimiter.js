import rateLimit from 'express-rate-limit';

/* Limiting the number of requests that can be made to the API. */
export const regularLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 100 requests per `window` (here, per 1 minute)
  statusCode: 429,
  message: {
    status: 'fail',
    request_url: async (request, response) => request.originalUr,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* Limiting the number of requests that can be made to the API. */
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per `window` (here, per 1 minute)
  statusCode: 429,
  message: {
    status: 'fail',
    request_url: async (request, response) => request.originalUr,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
