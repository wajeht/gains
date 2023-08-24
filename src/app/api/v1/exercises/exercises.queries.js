import db from '../../../../database/db.js';

export function getAllExercises() {
  return db.select('*').from('exercises').where({ deleted: false }).orderBy('id', 'desc');
}

export function getExerciseById(id) {
  return db.select('*').from('exercises').where({ id }).andWhere({ deleted: false });
}

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
      isLengthAware: true,
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

export function getExerciseByUserId(uid, options = { orderBy: 'id', direction: 'desc' }) {
  return db
    .select('e.*', 'ec.name as category_name')
    .from('exercises as e')
    .fullOuterJoin('exercise_categories as ec', 'ec.id', 'e.exercise_category_id')
    .where({ 'e.user_id': uid })
    .andWhere({ 'e.deleted': false })
    .andWhere({ 'ec.deleted': false })
    .orderBy(`e.${options.orderBy}`, options.direction);
}

export function searchExerciseName(name, uid, ecid) {
  return db
    .select('*')
    .from('exercises')
    .where({ user_id: uid })
    .andWhere({ exercise_category_id: ecid })
    .andWhereLike('name', name);
}

export function createExercise(data) {
  return db.insert(data).into('exercises').returning('*');
}

export async function updateExerciseNote({ notes, lid, user_id, session_id, exercise_id }) {
  return db
    .update({ notes: notes })
    .from('logs')
    .where({ id: lid })
    .andWhere({ session_id })
    .andWhere({ user_id })
    .returning('*');
}
