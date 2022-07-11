import db from '../../../../database/db.js';

/**
 * It takes a body object, inserts it into the sessions table, and returns the newly created session
 * @param body - an object containing the following properties:
 * @returns The session that was created
 */
export function createASession(body) {
  return db
    .insert({ ...body })
    .into('sessions')
    .returning('*');
}

/**
 * Get all sessions for a given user.
 * @param user_id - The user_id of the user whose sessions you want to retrieve.
 * @returns An array of objects
 */
export function getSessionsByUserId(user_id) {
  return db.select('*').from('sessions').where({ user_id });
}

/**
 * Get the session from the database by the session id.
 * @param sid - The session ID.
 * @returns An array of objects
 */
export function getSessionBySessionId(sid) {
  return db.select('*').from('sessions').where({ id: sid });
}
