import redis from '../../../../utils/redis.js';

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
        redis.del(key);
      }
    });
  });
}
