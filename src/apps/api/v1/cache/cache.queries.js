import redis from '../../../../utils/redis.js';
import logger from '../../../../utils/logger.js';

/**
 * It gets the value of a key from the Redis cache
 * @param key - The key to be used to store the data in the cache.
 * @returns A promise that resolves to the value of the key in the cache.
 */
export async function getCacheByKey(key) {
  return await redis.get(key);
}

/**
 * It deletes all the keys in the redis cache that contain the user_id
 * @param user_id - The user id of the user whose cache you want to delete.
 * @returns the keys of the redis database.
 */
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

/**
 * It deletes all the keys in Redis that match the pattern "user-id-.-request-download-user-data".
 * @returns a promise that resolves to the value of the redis.get() call.
 */
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
