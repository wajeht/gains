import db from '../../../../database/db.js';

/**
 * Get all exercise categories from the database, ordered by id in descending order.
 * @returns An array of objects.
 */
export function getAllExerciseCategories() {
  return db.select('*').from('exercise_categories').orderBy('id', 'desc');
}

/**
 * Get all exercise categories for a user.
 * @param uid - the user id
 * @returns An array of objects.
 */
export function getExerciseCategoriesByUserId(uid) {
  return db.select('*').from('exercise_categories').where({ user_id: uid }).orderBy('id', 'desc');
}

/**
 * Search for an exercise category name in the database.
 * @param name - the name of the exercise category
 * @param uid - the user id of the user who created the exercise category
 * @returns An array of objects
 */
export function searchExerciseCategoryName(name, uid) {
  return db
    .select('*')
    .from('exercise_categories')
    .where({ user_id: uid })
    .andWhereLike('name', `%${name}%`);
}

/**
 * It inserts a new exercise category into the database and returns the newly created exercise category
 * @param [body] - The body of the request.
 * @returns The exercise category that was created.
 */
export function createExerciseCategory(body = { name, user_id }) {
  return db.insert(body).into('exercise_categories').returning('*');
}
