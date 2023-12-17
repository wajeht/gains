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
import { jwt_secret, SENTRY_URL } from '../config/env.js';
import * as Middlewares from './api/api.middlewares.js';
import CustomError from './api/api.errors.js';
import logger from '../utils/logger.js';
import redis from '../utils/redis.js';
import Sentry from '@sentry/node';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

Sentry.init({
  dsn: SENTRY_URL,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({
      app,
    }),
  ],
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

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
  express.static(path.resolve(path.join(process.cwd(), 'src', 'public')), {
    // 30 days in milliseconds
    maxage: 2592000000,
  }),
);

// app.get('/debug-sentry', (req, res) => {
//   throw new Error('My first Sentry error!');
// });

app.use('/docs/*', (req, res, next) => Middlewares.authenticateUser(req, res, next, true));

expressJSDocSwagger(app)(expressJsdocOptions);

io.on('connection', async function (socket) {
  logger.info(`socket.io connection was made!, ${socket.id}`);

  let onlineUsers = JSON.parse(await redis.get('onlineUsers')) || [];

  socket.emit('onlineUser', onlineUsers);

  socket.on('onlineUser', async (userData) => {
    logger.info(`onlineUser event was fired!, ${socket.id}`);

    const userExist = onlineUsers.some(
      (user) => user.id === userData.id && socket.id === user.socket_id,
    );

    if (!userExist) {
      onlineUsers.push({
        ...userData,
        socket_id: socket.id,
      });

      await redis.set('onlineUsers', JSON.stringify(onlineUsers));
      socket.broadcast.emit('onlineUser', onlineUsers);
    }
  });

  socket.on('userDisconnected', async (userData) => {
    logger.info(`userDisconnected event was fired!, ${socket.id}`);
    let onlineUsers = JSON.parse(await redis.get('onlineUsers')) || [];

    onlineUsers = onlineUsers.filter(
      (user) => user.id !== userData.id && user.socket_id !== socket.id,
    );

    await redis.set('onlineUsers', JSON.stringify(onlineUsers));

    socket.broadcast.emit('userDisconnected', userData.id);
  });

  socket.on('disconnect', async () => {
    logger.info(`socket.io connection was dropped!, ${socket.id}`);

    let onlineUsers = JSON.parse(await redis.get('onlineUsers')) || [];

    onlineUsers = onlineUsers.filter((user) => user.socket_id !== socket.id);

    await redis.set('onlineUsers', JSON.stringify(onlineUsers));

    socket.broadcast.emit('userDisconnected', socket.id);
  });
});

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
  // matching /api/v[number]/
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

app.use(Sentry.Handlers.errorHandler());
app.use(AppRoutes.notFoundHandler);
app.use(AppRoutes.errorHandler);

export default server;
