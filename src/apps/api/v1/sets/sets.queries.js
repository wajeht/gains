import db from '../../../../database/db.js';

/**
 * It takes in a body object, inserts it into the sets table, and returns the inserted object
 * @param [body] - an object with the following keys:
 * @returns The entire row of the set that was just created.
 */
// prettier-ignore
export function createSet(body = { user_id, exercise_id, session_id, description, notes, reps, rpe }) {
  // prettier-ignore
  return db.insert(body).into('sets').returning('*');
}
