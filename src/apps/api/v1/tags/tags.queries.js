import db from '../../../../database/db.js';

export function createATag(body = { user_id, log_id, name }) {
  return db.insert(body).into('tags').returning('*');
}
