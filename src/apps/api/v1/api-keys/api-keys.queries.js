import db from '../../../../database/db.js';

export function getApiKey(user_id) {
  return db.select('*').from('api_keys').where({ user_id }).andWhere({ deleted: false });
}

export function getApiKeyByApiId(api_key_id) {
  return db.select('*').from('api_keys').where({ id: api_key_id }).andWhere({ deleted: false });
}

export function saveApiKeys(data) {
  return db.insert(data).into('api_keys').returning('*');
}

export function deleteApiKey(user_id, api_key_id) {
  return db
    .update({ deleted: true })
    .from('api_keys')
    .where({ user_id: user_id })
    .andWhere({ id: api_key_id })
    .returning('*');
}
