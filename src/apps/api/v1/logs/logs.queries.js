import db from '../../../../database/db.js';

/**
 * It takes a body object, inserts it into the logs table, and returns the inserted object
 * @param body - The body of the log.
 * @returns The entire row of the newly created log.
 */
export function createLog(body) {
  return db.insert(body).into('logs').returning('*');
}

/**
 * Get the log with the given id.
 * @param log_id - The id of the log you want to get.
 * @returns An array of objects
 */
export function getLogById(log_id) {
  return db.select('*').from('logs').where({ id: log_id });
}
