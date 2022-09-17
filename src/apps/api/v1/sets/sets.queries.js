import { omit } from 'lodash-es';
import db from '../../../../database/db.js';

/**
 * It takes in a body object, inserts it into the sets table, and returns the inserted object
 * @param [body] - an object with the following keys:
 * @returns The entire row of the set that was just created.
 */
// prettier-ignore
export function createSet(body = { user_id, exercise_id, session_id, description, notes, reps, rpe }) {
  // prettier-ignore
  return db.insert(body).into('sets').returning('*');
}

/**
 * Get the set with the given id from the database.
 * @param setId - The id of the set you want to get.
 * @returns An array of objects
 */
export function getSetById(setId) {
  return db.select('*').from('sets').where({ id: setId });
}

/**
 * Update a set in the database, returning the updated set.
 * @param body - the object that contains the data that you want to update
 * @param id - the id of the set you want to update
 * @returns The updated set
 */
export function updateSetById(body, id) {
  const withoutId = omit(body, ['id']);
  return db.update(withoutId).from('sets').where({ id }).returning('*');
}

export function getAllSetsByUserId(user_id) {
  return db.select('*').from('sets').where({ deleted: false }).andWhere({ user_id });
}

/**
 * It deletes a set by id
 * @param id - the id of the set you want to delete
 * @returns The updated set with the deleted flag set to true.
 */
export function deleteSetById(id, body) {
  return db
    .update({ deleted: true })
    .from('sets')
    .where({ id })
    .andWhere({ ...body })
    .returning('*');
}
