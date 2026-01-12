import db from '../../../../database/db.js';

export function createBlock(body = { name, description, start_date, end_date, user_id }) {
  return db.insert(body).into('blocks').returning('*');
}

export function getBlockByBlockId(bid) {
  return db.select('*').from('blocks').where({ id: bid });
}

export function getBlocksByUserId(uid) {
  return db.select('*').from('blocks').where({ user_id: uid }).orderBy('id', 'desc');
}

export function getAllBlocks() {
  return db.select('*').from('blocks');
}
