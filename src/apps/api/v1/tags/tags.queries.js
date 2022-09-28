import { omit } from 'lodash-es';
import db from '../../../../database/db.js';

/**
 * It takes in a body object, inserts it into the tags table, and returns the inserted object
 * @param [body] - an object with the following keys:
 * @returns The entire row of the newly created tag.
 */
export function createATag(body = { user_id, log_id, name }) {
  return db.insert(body).into('tags').returning('*');
}
