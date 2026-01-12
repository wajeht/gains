import path from 'path';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import cookieParser from 'cookie-parser';
import apiRoutes from './api/api.routes.js';
import * as AppRoutes from './app.routes.js';
import { regularLimiter, apiLimiter } from './config/rate-limiter.config.js';
import { jwt_secret } from './config/env.js';
import CustomError from './api/api.errors.js';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", 'gains.jaw.dev', 'localhost'],
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

app.use('/api', apiLimiter, apiRoutes);
app.use('/health', AppRoutes.getHealthCheck);

app.use((req, res, next) => {
  if (req.url.match(/\/api\/v\d\//g)) {
    throw new CustomError.BadRequestError('The resource does not exist!');
  }
  next();
});

app.use('/{*splat}', regularLimiter, AppRoutes.vueHandler);

app.use(AppRoutes.notFoundHandler);
app.use(AppRoutes.errorHandler);

export default app;
