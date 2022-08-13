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

/**
 * It updates the private state of a log
 * @param log_id - The id of the log you want to update
 * @param private_state - true or false
 * @returns A promise
 */
export function updatePrivateState(log_id, private_state) {
  return db.update({ private: private_state }).from('logs').where({ id: log_id }).returning('*');
}

/**
 * It takes an array of logs, inserts them into the database, and returns the inserted logs
 * @param logs - an array of objects that contain the following properties:
 * @returns An array of objects
 */
export function createMultipleLogs(logs) {
  return db.insert(logs).into('logs').returning('*');
}

/**
 * It updates the deleted column of the logs table to true where the id matches the id passed in
 * @param id - The id of the log you want to delete.
 * @returns A promise
 */
export function deleteALog(id) {
  return db.update({ deleted: true }).from('logs').where({ id }).returning('*');
}
