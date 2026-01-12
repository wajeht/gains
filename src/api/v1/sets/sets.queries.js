import { omit } from 'lodash-es';
import db from '../../../../database/db.js';

export function createSet(
  body = { user_id, exercise_id, session_id, description, notes, reps, rpe },
) {
  return db.insert(body).into('sets').returning('*');
}

export function getSetById(setId) {
  return db.select('*').from('sets').where({ id: setId });
}

export function updateSetById(body, id) {
  const withoutId = omit(body, ['id']);
  return db.update(withoutId).from('sets').where({ id }).returning('*');
}

export function getAllSetsByUserId(user_id) {
  return db.select('*').from('sets').where({ deleted: false }).andWhere({ user_id });
}

export function deleteSetById(id, body) {
  return db
    .update({ deleted: true })
    .from('sets')
    .where({ id })
    .andWhere({ ...body })
    .returning('*');
}
