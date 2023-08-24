import db from '../../../../database/db.js';

export function getAllExerciseCategories() {
  return db.select('*').from('exercise_categories').orderBy('id', 'desc');
}

export async function getExerciseCategoriesByUserId(uid) {
  return await db('exercise_categories as ec')
    .select('ec.*')
    .join('exercises as e', 'e.exercise_category_id', 'ec.id')
    .where({
      'ec.deleted': false,
      'e.deleted': false,
      'ec.user_id': uid,
    })
    .groupBy('ec.id')
    .orderBy('ec.id', 'desc');
}

export async function getAllExerciseCategoriesByUserId(uid) {
  return await db('exercise_categories as ec')
    .select('ec.*')
    .count('e.id as exercises_counts')
    .fullOuterJoin('exercises as e', 'e.exercise_category_id', 'ec.id')
    .where('ec.deleted', false)
    .andWhere('ec.user_id', uid)
    .groupBy('ec.id')
    .orderBy('ec.id', 'desc');
}

export function getExerciseCategoriesById(ecid) {
  return db
    .select('*')
    .from('exercise_categories')
    .where({ id: ecid })
    .andWhere({ deleted: false });
}

export function getExercisesByExerciseCategoryId(ecid) {
  return db
    .select(
      '*',
      'exercises.name as name',
      'exercises.id as id',
      'exercise_categories.name as category_name',
    )
    .from('exercises')
    .innerJoin('exercise_categories', 'exercises.exercise_category_id', 'exercise_categories.id')
    .where({ 'exercise_categories.id': ecid });
}

export function searchExerciseCategoryName(name, uid) {
  return db
    .select('*')
    .from('exercise_categories')
    .where({ user_id: uid })
    .andWhereLike('name', `%${name}%`);
}

export function createExerciseCategory(data) {
  return db.insert(data).into('exercise_categories').returning('*');
}
