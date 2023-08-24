import db from '../../../database/db.js';

export async function verifyUser(uid, date) {
  return db
    .update({ verified: true, verified_at: date })
    .from('user_details')
    .where({ user_id: uid })
    .returning('*');
}

export async function generatePasswordResetToken(uid, token, expiration) {
  return db
    .update({
      password_reset_token: token,
      password_reset_token_expiration: expiration,
    })
    .from('user_details')
    .where({ user_id: uid });
}
