import db from '../../../database/db.js';

/**
 * It updates the is_verified column of the user_details table to true where the user_id is equal to
 * the uid passed in as a parameter
 * @param uid - The user id of the user to be verified.
 * @returns A promise
 */
export async function verifyUser(uid) {
  return db.update({ is_verified: true }).from('user_details').where({ user_id: uid });
}
