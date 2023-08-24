import db from '../../../../database/db.js';
import pkg from '../../../../utils/pkg.js';

export function subscribeChangelog({ user_id, email }) {
  return db
    .insert({ user_id, email, object: 'changelog', object_id: pkg.version })
    .into('subscriptions')
    .returning('*');
}

export function UnsubscribeChangelog({ user_id, email }) {
  return db
    .update({ deleted: true })
    .from('subscriptions')
    .where({ user_id })
    .andWhere({ email })
    .andWhere({ deleted: false })
    .returning('*');
}

export function hasSubscribedToChangelog(email) {
  return db
    .select('*')
    .from('subscriptions')
    .where({ deleted: false })
    .andWhere({ email: email })
    .andWhere({ object: 'changelog' });
}
