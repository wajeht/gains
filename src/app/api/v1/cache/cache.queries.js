import redis from '../../../../utils/redis.js';
import logger from '../../../../utils/logger.js';

export async function getCacheByKey(key) {
  return await redis.get(key);
}

export async function deleteAllCachesOfAUser(user_id) {
  redis.keys('*', function (err, keys) {
    if (err) return null;

    keys.forEach((key) => {
      if (key.includes(`user-id-${user_id}`)) {
        if (key === `user-id-${user_id}-request-download-user-data`) {
          logger.info(`Skipping ${key} count!`);
        } else {
          redis.del(key);
          logger.info(`Deleted redis cache ${key}!`);
        }
      }
    });
  });
}

export async function clearDownloadUserDataRequestCounts() {
  redis.keys('*', function (err, keys) {
    if (err) return null;
    keys.forEach((key) => {
      logger.info(`Deleted redis cache ${key}!`);
      if (key.match(/user-id-.-request-download-user-data/)) {
        redis.del(key);
      }
    });
  });
}
