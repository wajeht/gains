import db from '../../../../database/db.js';

/**
 * This function returns the last 8 body weights for a given user
 * @param user_id - the user's id
 * @returns An array of objects with the following properties:
 * id, body_weight, date, user_id
 */
export function weeklyWeightInByUserId(user_id) {
  return db
    .select('id', 'body_weight', ' created_at as date', 'user_id')
    .from('variables')
    .where({ user_id })
    .andWhere({ deleted: false })
    .andWhereRaw(`body_weight is not null`)
    .orderBy('id', 'desc')
    .limit(8);
}
