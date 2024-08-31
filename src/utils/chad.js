import logger from './logger.js';
import { env } from '../config/env.js';

export default class Chad {
  static async flex(msg, object = null) {
    try {
      let params;

      // use different format to send if we have object passed in
      if (object == null) {
        params = { username: 'Chad', content: msg };
      } else {
        params = {
          username: 'Chad',
          content: msg,
          embeds: [
            {
              title: msg,
              description: object,
            },
          ],
        };
      }

      if (env === 'production') {
        const res = await fetch(notify.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': notify.xApiKey,
          },
          body: JSON.stringify(params),
        });

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
