import db from '../../../../database/db.js';

export function createLog(body) {
  return db.insert(body).into('logs').returning('*');
}

export function getLogById(log_id) {
  return db.select('*').from('logs').where({ id: log_id });
}

export function updatePrivateState(log_id, private_state) {
  return db.update({ private: private_state }).from('logs').where({ id: log_id }).returning('*');
}

export function createMultipleLogs(logs) {
  return db.insert(logs).into('logs').returning('*');
}

export function deleteALog(id) {
  return db.update({ deleted: true }).from('logs').where({ id }).returning('*');
}

export function getAllLogsByUserId(user_id) {
  return db.select('*').from('logs').where({ deleted: false }).andWhere({ user_id });
}
