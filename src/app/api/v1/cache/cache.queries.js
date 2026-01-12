import cache from '../../../../utils/cache.js';
import logger from '../../../../utils/logger.js';

export async function getCacheByKey(key) {
  return await cache.get(key);
}

export async function deleteAllCachesOfAUser(user_id) {
  cache.keys('*', function (err, keys) {
    if (err) return null;

    keys.forEach((key) => {
      if (key.includes(`user-id-${user_id}`)) {
        if (key === `user-id-${user_id}-request-download-user-data`) {
          logger.info(`Skipping ${key} count!`);
        } else {
          cache.del(key);
          logger.info(`Deleted cache ${key}!`);
        }
      }
    });
  });
}

export async function clearDownloadUserDataRequestCounts() {
  cache.keys('*', function (err, keys) {
    if (err) return null;
    keys.forEach((key) => {
      logger.info(`Deleted cache ${key}!`);
      if (key.match(/user-id-.-request-download-user-data/)) {
        cache.del(key);
      }
    });
  });
}
