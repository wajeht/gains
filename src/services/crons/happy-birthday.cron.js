import Logger from '../../utils/logger.js';

import EmailServices from '../../services/email.service.js';
import * as UsersServices from '../../apps/api/v1/users/users.queries.js';

export default async function sendHappyBirthdayEmailCron() {
  try {
    Logger.info('sendHappyBirthdayEmailCron() cron has started!');

    const users = await UsersServices.getAllUsersWhoseBirthdayIsToday();

    await Promise.all(
      users.map((user) => {
        return EmailServices.send({
          to: user.email,
          subject: 'Happy Birthday',
          template: 'happy-birthday',
          data: {
            username: user.username,
          },
        });
      }),
    );

    Logger.info('sendHappyBirthdayEmailCron() cron has finished!');
  } catch (e) {
    Logger.error(e.message);
  }
}
