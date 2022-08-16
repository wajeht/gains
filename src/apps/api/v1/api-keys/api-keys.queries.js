import db from '../../../../database/db.js';

/**
 * "Get the API key for the given user ID."
 *
 * The function is named getApiKey, and it takes one argument, user_id. It returns the result of a
 * database query
 * @param user_id - The user_id of the user you want to get the API key for.
 * @returns An array of objects
 */
export function getApiKey(user_id) {
  return db.select('*').from('api_keys').where({ user_id }).andWhere({ deleted: false });
}

/**
 * "Get the API key by the API key ID."
 *
 * The function is a bit more complicated than that, but that's the gist of it
 * @param api_key_id - The ID of the API key you want to retrieve.
 * @returns An array of objects
 */
export function getApiKeyByApiId(api_key_id) {
  return db.select('*').from('api_keys').where({ id: api_key_id }).andWhere({ deleted: false });
}

/**
 * It takes in an object, inserts it into the api_keys table, and returns the inserted object
 * @param data - The data to be inserted into the database.
 * @returns The data that was inserted into the database.
 */
export function saveApiKeys(data) {
  return db.insert(data).into('api_keys').returning('*');
}

/**
 * "Delete an API key by marking it as deleted."
 *
 * The function takes two parameters:
 *
 * user_id: The ID of the user who owns the API key.
 * api_key_id: The ID of the API key to delete.
 * The function returns a promise that resolves to the deleted API key
 * @param user_id - The user_id of the user who owns the api key
 * @param api_key_id - The ID of the API key to delete.
 * @returns The updated api_key
 */
export function deleteApiKey(user_id, api_key_id) {
  return db
    .update({ deleted: true })
    .from('api_keys')
    .where({ user_id: user_id })
    .andWhere({ id: api_key_id })
    .returning('*');
}
