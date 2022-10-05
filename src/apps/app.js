import path from 'path';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import apiRoutes from './api/api.routes.js';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import expressJsdocOptions from '../config/express-jsdoc-options.js';
import * as AppRoutes from './app.routes.js';
import { regularLimiter, apiLimiter } from '../config/rate-limiter.config.js';
import { jwt_secret } from '../config/env.js';
import * as Middlewares from './api/api.middlewares.js';
import CustomError from './api/api.errors.js';
import logger from '../utils/logger.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Caddy, Express, Apache, Nginx, Nuxt, IIS');
  next();
});

// TODO!: configure this helmet for production
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    hidePoweredBy: false,
  }),
);
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(jwt_secret));
app.use(
  express.static(path.resolve(path.join(process.cwd(), 'src', 'public')), {
    maxage: '24h',
  }),
);

app.use('/docs/*', (req, res, next) => Middlewares.authenticateUser(req, res, next, true));
expressJSDocSwagger(app)(expressJsdocOptions);

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', function (socket) {
  logger.info('socket.io connection was made!');
});

app.use('/api', apiLimiter, apiRoutes);
app.use('/health', AppRoutes.getHealthCheck);

app.use((req, res, next) => {
  // matching /api/v[number]/
  const isApiPrefix = req.url.match(/\/api\/v\d\//g);

  // console.log(req.url);
  if (isApiPrefix) {
    throw new CustomError.BadRequestError('The resource does not exist!');
  }

  next();
});

app.use('*', regularLimiter, AppRoutes.vueHandler);

app.use(AppRoutes.notFoundHandler);
app.use(AppRoutes.errorHandler);

export default server;
