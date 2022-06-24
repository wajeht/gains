import pino from 'pino';
import { root } from '../utils/directory.js';

const today = new Date().toISOString().split('T')[0];

const levels = {
  emerg: 80,
  alert: 70,
  crit: 60,
  error: 50,
  warn: 40,
  notice: 30,
  info: 20,
  debug: 10,
};

/*eslint-disable*/
const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'debug',
    customLevels: levels,
    useOnlyCustomLevels: true,
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
    transport: {
      target: 'pino-pretty',
      destination: `${root}/logs/${today}.log`,
    },
  },
  pino.destination(`${root}/logs/${today}.log`),
);

export default logger;
