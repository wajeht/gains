import db from '../../../../database/db.js';

export function createGainsMeta(body = { user_id, object, object_id, description, json }) {
  return db.insert(body).into('gains_meta').returning('*');
}
