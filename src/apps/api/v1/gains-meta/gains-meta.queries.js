import db from '../../../../database/db.js';

/**
 * It takes in a body object, and returns a promise that resolves to an array of objects
 * @param [body] - an object with the following keys:
 * @returns The entire row of the newly created gains-meta
 */
export function createGainsMeta(body = { user_id, object, object_id, description, json }) {
  return db.insert(body).into('gains_meta').returning('*');
}
