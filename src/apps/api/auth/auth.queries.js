import db from '../../../database/db.js';

/**
 * It updates the verified column of the user_details table to true where the user_id is equal to
 * the uid passed in as a parameter
 * @param uid - The user id of the user to be verified.
 * @returns A promise
 */
export async function verifyUser(uid, date) {
  return db
    .update({ verified: true, verified_at: date })
    .from('user_details')
    .where({ user_id: uid })
    .returning('*');
}

/**
 * Update the password reset token and expiration for the user with the given uid.
 * @param uid - The user's ID
 * @param token - The token that will be used to reset the password.
 * @param expiration - The expiration date of the token.
 * @returns The user's password reset token and expiration date.
 */
export async function generatePasswordResetToken(uid, token, expiration) {
  return db
    .update({
      password_reset_token: token,
      password_reset_token_expiration: expiration,
    })
    .from('user_details')
    .where({ user_id: uid });
}
