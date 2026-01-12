import path from 'path';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import cookieParser from 'cookie-parser';
import apiRoutes from './api/api.routes.js';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import expressJsdocOptions from './config/express-jsdoc-options.js';
import * as AppRoutes from './app.routes.js';
import { regularLimiter, apiLimiter } from './config/rate-limiter.config.js';
import { jwt_secret } from './config/env.js';
import * as Middlewares from './api/api.middlewares.js';
import CustomError from './api/api.errors.js';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'default-src': ["'self'", 'plausible.jaw.dev'],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          'gains.jaw.dev',
          'localhost',
          'plausible.jaw.dev',
        ],
        'manifest-src': ["'self'", 'data:'],
      },
    },
  }),
);

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(jwt_secret));
app.use(
  express.static(path.resolve(path.join(process.cwd(), 'public')), {
    maxage: 2592000000,
  }),
);

app.use('/docs/*', (req, res, next) => Middlewares.authenticateUser(req, res, next, true));

expressJSDocSwagger(app)(expressJsdocOptions);

/**
 * GET /api
 * @tag app
 * @summary gains api routes
 */
app.use('/api', apiLimiter, apiRoutes);

/**
 * GET /health
 * @tag app
 * @summary gains health check route
 */
app.use('/health', AppRoutes.getHealthCheck);

app.use((req, res, next) => {
  if (req.url.match(/\/api\/v\d\//g)) {
    throw new CustomError.BadRequestError('The resource does not exist!');
  }
  next();
});

/**
 * GET /
 * @tag app
 * @summary gains home page
 */
app.use('*', regularLimiter, AppRoutes.vueHandler);

app.use(AppRoutes.notFoundHandler);
app.use(AppRoutes.errorHandler);

export default app;
