import crypto from 'crypto';
import { styleText } from 'node:util';
import { AsyncLocalStorage } from 'async_hooks';

const store = new AsyncLocalStorage();
const levelColors = { debug: 'magenta', info: 'cyan', warn: 'yellow', error: 'red' };

export function createLogger(service = 'app') {
  const ctx = () => store.getStore() || {};

  const set = (data) => Object.assign(ctx(), data);

  const withContext = (data, fn) => store.run({ ...ctx(), ...data }, fn);

  const log = (level, msg, data = {}) => {
    if (process.env?.LOG_LEVEL === 'silent') return;
    const output = JSON.stringify({
      ts: new Date().toISOString(),
      level,
      service,
      msg,
      ...ctx(),
      ...data,
    });
    process.stdout.write(styleText(levelColors[level] || 'white', output) + '\n');
  };

  const middleware = () => (req, res, next) => {
    const start = Date.now();
    const init = {
      request_id: req.get('x-request-id') || 'req_' + crypto.randomBytes(8).toString('hex'),
      method: req.method,
      path: req.path,
    };

    res.on('finish', () =>
      log('info', 'request', { status: res.statusCode, ms: Date.now() - start }),
    );

    store.run(init, next);
  };

  return {
    middleware,
    set,
    withContext,
    info: (msg, data) => log('info', msg, data),
    warn: (msg, data) => log('warn', msg, data),
    error: (msg, data) => log('error', msg, data),
    debug: (msg, data) => log('debug', msg, data),
  };
}

const logger = createLogger('gains');
export default logger;
