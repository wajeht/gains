import db from '../../../../database/db.js';

/**
 * It returns all exercises from the database, ordered by their
 * id in descending order
 * @returns An array of objects.
 */
export function getAllExercises() {
  return db.select('*').from('exercises').orderBy('id', 'desc');
}

/**
 * It takes in an object with the keys `name`, `exercise_category_id`, and `user_id` and inserts it
 * into the `exercises` table, returning the newly created exercise
 * @param [body] - an object with the following keys: name, exercise_category_id, user_id
 * @returns The exercise that was just created.
 */
export function createExercise(body = { name, exercise_category_id, user_id }) {
  return db.insert(body).into('exercises').returning('*');
}
