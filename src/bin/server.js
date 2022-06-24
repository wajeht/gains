#!/usr/bin/env node

import app from '../apps/app.js';
import { port } from '../config/env.js';
import { green } from '../utils/rainbow-log.js';

app.listen(port, () => green(`App is running on http://localhost:${port}`));
