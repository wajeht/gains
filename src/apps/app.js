import path from 'path';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import express from 'express';
const app = express();

import api from './api/api.js';
import * as AppController from './app.controller.js';

// TODO!: configure this helmet for production
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(cors({ origin: '*' }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(path.join(process.cwd(), "src", "public")))); // prettier-ignore

app.use('/api', api);
app.use('/health', AppController.getHealthCheck);
app.use('*', AppController.vueHandler);

export default app;
