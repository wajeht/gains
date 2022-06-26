#!/usr/bin/env node

import app from '../apps/app.js';
import { port } from '../config/env.js';
import { green, red } from '../utils/rainbow-log.js';
import logger from '../libs/logger.js';

app.listen(port, () => logger.info(`App is running on http://localhost:${port}`));
