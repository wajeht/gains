import sendHappyBirthdayEmailCron from './crons/happy-birthday.cron.js';

import Logger from '../utils/logger.js';
import cron from 'node-cron';

export default class CronsServices {
  static async start() {
    try {
      Logger.info(`Crons services was started!`);

      // everyday at mid night
      cron.schedule('0 0 * * *', sendHappyBirthdayEmailCron).start();
    } catch (e) {
      Logger.error(e.message);
    }
  }
}
