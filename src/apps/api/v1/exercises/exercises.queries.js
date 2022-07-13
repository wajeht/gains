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
 * Get all the columns from the exercises table where the id is equal to the id passed in and where the
 * deleted column is false.
 * @param id - The id of the exercise you want to get.
 * @returns An array of objects
 */
export function getExerciseById(id) {
  return db.select('*').from('exercises').where({ id }).andWhere({ deleted: false });
}

/**
 * Get all exercises from the database where the user_id matches the uid passed in and where the
 * deleted column is false.
 * @param uid - the user id of the user who created the exercise
 * @returns An array of objects
 */
export function getExerciseByUserId(uid) {
  return db.select('*').from('exercises').where({ user_id: uid }).andWhere({ deleted: false });
}

/**
 * Search for an exercise name in the database and return the results.
 * @param name - the name of the exercise
 * @param uid - the user id
 * @returns An array of objects
 */
export async function searchExerciseName(name, uid) {
  try {
    return await db
      .select('*')
      .from('exercises')
      .where({ user_id: uid })
      .andWhereLike('name', `%${name}%`);
  } catch (e) {
    return e;
  }
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
