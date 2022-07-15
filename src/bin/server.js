#!/usr/bin/env node

import app from '../apps/app.js';
import { port, env, vue_port } from '../config/env.js';
import { green, red } from '../utils/rainbow-log.js';
import logger from '../libs/logger.js';

app.listen(port, () => {
  logger.warn(`Server is on ${env} mode!`);
  logger.info(`Server is running on http://localhost:${port}!`);
  if (process.env.HMR === 'true') logger.warn(`But use http://localhost:${vue_port} for hmr!`);
});
