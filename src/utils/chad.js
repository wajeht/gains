import logger from './logger.js';
import { env, notify } from '../config/env.js';

export default class Chad {
  static async flex(msg, object = null) {
    try {

      if (env !== 'production') {
        const res = await fetch(notify.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': notify.xApiKey,
          },
          body: JSON.stringify({
            message: msg,
            details: object,
          }),
        });

        console.log(await res.json());

        if (res.ok) {
          logger.info(`Chad sent ${msg}`);
        } else {
          logger.error(`Failed to send Chad message: ${res.statusText}`);
        }

      } else {
        logger.warn('Skipping Chad message in dev environment!');
      }

    } catch (e) {

      logger.error(e.message);

      await fetch(notify.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': notify.xApiKey,
        },
        body: JSON.stringify({
          message: e.message,
          details: e.stack,
        }),
      });

    }
  }
}
