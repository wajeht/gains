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
export async function getExerciseCategoriesByUserId(uid) {
  // return db.select('*').from('exercise_categories').where({ user_id: uid }).orderBy('id', 'desc');
  // only return categories which have exercises, an hide the rest
  const { rows } = await db.raw(
    `
    SELECT
	    ec.*
    FROM
	    exercise_categories ec
	  INNER JOIN exercises e
      ON e.exercise_category_id = ec.id
    WHERE (
      ec.deleted = false
      and ec.user_id = ?
    )
    GROUP BY ec.id
    ORDER BY ec.id DESC
  `,
    [uid],
  );

  return rows;
}

/**
 * Get all exercise categories for a user.
 * @param uid - the user id
 * @returns An array of objects.
 */
export async function getAllExerciseCategoriesByUserId(uid) {
  // return db.select('*').from('exercise_categories').where({ user_id: uid }).orderBy('id', 'desc');
  // only return categories which have exercises, an hide the rest
  const { rows } = await db.raw(
    `
    SELECT
	    *
    FROM
	    exercise_categories ec
    WHERE (
      ec.deleted = false
      and ec.user_id = ?
    )
    ORDER BY ec.id DESC
  `,
    [uid],
  );

  return rows;
}

/**
 * This function returns all exercise categories that have not been deleted.
 * @param ecid - The id of the exercise category you want to get.
 * @returns An array of objects
 */
export function getExerciseCategoriesById(ecid) {
  return db
    .select('*')
    .from('exercise_categories')
    .where({ id: ecid })
    .andWhere({ deleted: false });
}

/**
 * Get all exercises that belong to a specific exercise category.
 * @param ecid - exercise category id
 * @returns An array of objects containing the exercises and exercise categories.
 */
export function getExercisesByExerciseCategoryId(ecid) {
  return db
    .select('*', 'exercises.name as name', 'exercises.id as id')
    .from('exercises')
    .innerJoin('exercise_categories', 'exercises.exercise_category_id', 'exercise_categories.id')
    .where({ 'exercise_categories.id': ecid });
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
// export function createExerciseCategory(body = { name, user_id }) {
//   return db.insert(body).into('exercise_categories').returning('*');
// }

/**
 * It takes in an object, inserts it into the database, and returns the object
 * @param data - an object containing the data to be inserted into the database
 * @returns The data that was inserted into the exercise_categories table.
 */
export function createExerciseCategory(data) {
  return db.insert(data).into('exercise_categories').returning('*');
}
