import Logger from '../../utils/logger.js';
import * as CachesQueries from '../../apps/api/v1/cache/cache.queries.js';

export default async function resetDownloadUserDataRequestCron() {
  try {
    Logger.info('resetDownloadUserDataRequestCron() cron has started!');

    await CachesQueries.clearDownloadUserDataRequestCounts();

    Logger.info('resetDownloadUserDataRequestCron() cron has finished!');
  } catch (e) {
    Logger.error(e.message);
  }
}
