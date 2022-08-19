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
 * Get all the sets for a given exercise, ordered by the date they were created.
 * @param id - the id of the exercise you want to get the history for
 * @returns An array of objects
 */
export async function getExerciseHistoryByExerciseId(
  id,
  pagination = { perPage: null, currentPage: null },
) {
  return db
    .select(
      's.reps',
      's.weight',
      's.rpe as rpe',
      's.notes as notes',
      's.created_at as created_at',
      'e.name as exercise_name',
      'ec.name as category_name',
      'e.id as exercise_id',
      'ec.id as category_id',
      's.id as set_id',
      's.session_id as session_id',
      's.log_id as log_id',
      'e.user_id as user_id',
    )
    .from('exercises as e')
    .innerJoin('sets as s', 's.exercise_id', 'e.id')
    .innerJoin('exercise_categories as ec', 'ec.id', 'e.exercise_category_id')
    .where({ 'e.deleted': false })
    .andWhere({ 'e.id': id })
    .orderBy('s.created_at', 'desc')
    .paginate({
      ...pagination,
    });

  // const { rows } = await db.raw(
  //   `
  //   select
  //     s.reps,
  //     s.weight,
  //     s.rpe as "rpe",
  //     s.notes as "notes",
  //     s.created_at as "created_at",
  //     e."name" as "exercise_name",
  //     ec."name" as "category_name",
  //     e.id as "exercise_id",
  //     ec.id as "category_id",
  //     s.id as "set_id",
  //     s.session_id as "session_id",
  //     s.log_id as "log_id",
  //     e.user_id as "user_id"
  //   from
  //     exercises e
  //     inner join sets s on s.exercise_id = e.id
  //     inner join exercise_categories ec on ec.id = e.exercise_category_id
  //   where
  //     e.deleted = false
  //     and e.id = ?
  //   order by
  //     s.created_at desc
  // `,
  //   [id],
  // );

  // return rows;
}

/**
 * Get all exercises from the database where the user_id matches the uid passed in and where the
 * deleted column is false.
 * @param uid - the user id of the user who created the exercise
 * @returns An array of objects
 */
export function getExerciseByUserId(uid, options = { orderBy: 'id', direction: 'desc' }) {
  return db
    .select('*')
    .from('exercises')
    .where({ user_id: uid })
    .andWhere({ deleted: false })
    .orderBy(options.orderBy, options.direction);
}

/**
 * "Search for an exercise name in the database, given a user id, exercise category id, and exercise
 * name."
 *
 * The function takes in three parameters:
 *
 * name: the name of the exercise
 * uid: the user id of the user
 * ecid: the exercise category id of the exercise category
 * The function returns a promise that resolves to an array of objects. Each object represents an
 * exercise
 * @param name - the name of the exercise
 * @param uid - user id
 * @param ecid - exercise category id
 * @returns An array of objects
 */
export function searchExerciseName(name, uid, ecid) {
  return db
    .select('*')
    .from('exercises')
    .where({ user_id: uid })
    .andWhere({ exercise_category_id: ecid })
    .andWhereLike('name', name);
}

/**
 * It takes in an object with the keys `name`, `exercise_category_id`, and `user_id` and inserts it
 * into the `exercises` table, returning the newly created exercise
 * @param [body] - an object with the following keys: name, exercise_category_id, user_id
 * @returns The exercise that was just created.
 */
// export function createExercise(body = { name, exercise_category_id, user_id }) {
//   return db.insert(body).into('exercises').returning('*');
// }

/**
 * It takes in an object, inserts it into the database, and returns the object
 * @param data - an object containing the data to be inserted into the database
 * @returns The data that was inserted into the database.
 */
export function createExercise(data) {
  return db.insert(data).into('exercises').returning('*');
}

/**
 * It updates the notes field of a gains_meta record
 * @returns The updated gains_meta row.
 */
export async function updateExerciseNote({ notes, lid, user_id, session_id, exercise_id }) {
  // const { rows } = await db.raw(
  //   `
  //   update gains_meta gm
  //   set json = jsonb_set(json, '{notes}', '??')
  //   where (
  //     gm.id = ?
  //     and gm.user_id = ?
  //     and (gm.json->'session_id')::int = ?
  //     and (gm.json->'exercise_id')::int = ?
  //   )
  //   returning *
  // `,
  //   [notes, gains_meta_id, user_id, session_id, exercise_id],
  // );
  // return rows;

  return db
    .update({ notes: notes })
    .from('logs')
    .where({ id: lid })
    .andWhere({ session_id })
    .andWhere({ user_id })
    .returning('*');
}
