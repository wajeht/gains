import db from '../../../../database/db.js';
import pkg from '../../../../utils/pkg.js';

/**
 * It subscribes a user to the changelog
 * @returns The user_id and email of the user who subscribed to the changelog.
 */
export function subscribeChangelog({ user_id, email }) {
  return db
    .insert({ user_id, email, object: 'changelog', object_id: pkg.version })
    .into('subscriptions')
    .returning('*');
}

/**
 * Update the deleted column to true for the row where the user_id and email match the provided user_id
 * and email, and where the deleted column is false, and return the updated row.
 * @returns The updated subscription
 */
export function UnsubscribeChangelog({ user_id, email }) {
  return db
    .update({ deleted: true })
    .from('subscriptions')
    .where({ user_id })
    .andWhere({ email })
    .andWhere({ deleted: false })
    .returning('*');
}

/**
 * Return all subscriptions that are not deleted, have the given email, and are subscribed to the
 * changelog.
 * @param email - the email address of the user
 * @returns An array of objects
 */
export function hasSubscribedToChangelog(email) {
  return db
    .select('*')
    .from('subscriptions')
    .where({ deleted: false })
    .andWhere({ email: email })
    .andWhere({ object: 'changelog' });
}
