import db from '../../../db/db.js';

export function getAVariable(variable_id) {
  return db.select('*').from('variables').where({ id: variable_id }).andWhere({ deleted: false });
}

export function deleteAVariable(variable_id, user_id) {
  return db
    .update({ deleted: true })
    .from('variables')
    .where({ id: variable_id })
    .andWhere({ user_id: user_id })
    .returning('*');
}

export function createAVariable(options) {
  return db.insert(options).into('variables').returning('*');
}

export function getAllBodyweightOfAUser(
  user_id,
  pagination = { perPage: null, currentPage: null },
) {
  return db
    .select('id', 'body_weight', 'created_at')
    .from('variables')
    .whereNotNull('body_weight')
    .andWhere({ user_id })
    .andWhere({ deleted: false })
    .orderBy('id', 'desc')
    .paginate({
      ...pagination,
      isLengthAware: true,
    });
}

export function getAllCaloriesOfAUser(user_id, pagination = { perPage: null, currentPage: null }) {
  return (
    db
      .select('id', 'calories_prior_session', 'total_calories', 'created_at')
      .from('variables')
      .where({ user_id })
      .andWhere({ deleted: false })
      .andWhereRaw(`(calories_prior_session is not null or total_calories is not null)`)
      .andWhere({ deleted: false })
      // .andWhereNot({ calories_prior_session: null })
      // .andWhereNot({ total_calories: null })
      .orderBy('id', 'desc')
      .paginate({
        ...pagination,
        isLengthAware: true,
      })
  );
}

export function weeklyWeightInByUserId(user_id) {
  return db
    .select('id', 'body_weight', ' created_at as date', 'user_id')
    .from('variables')
    .where({ user_id })
    .andWhere({ deleted: false })
    .andWhereRaw(`body_weight is not null`)
    .orderBy('id', 'desc')
    .limit(8);
}

export async function recentPrsByUserId(user_id) {
  // Get top sets per exercise (1-3 reps, RPE 7-10)
  const sets = await db
    .select(
      's.id as set_id',
      'e.id as exercise_id',
      'e.name as name',
      's.reps',
      's.weight',
      's.rpe',
      's.session_id',
      's.created_at as date',
    )
    .from('sets as s')
    .innerJoin('exercises as e', 'e.id', 's.exercise_id')
    .innerJoin('sessions as ss', 'ss.id', 's.session_id')
    .whereBetween('s.reps', [1, 3])
    .andWhereBetween('s.rpe', [7, 10])
    .andWhere('ss.deleted', false)
    .andWhere('s.user_id', user_id)
    .orderBy('s.created_at', 'desc');

  // Group by exercise and take first (most recent) set per exercise
  const exerciseMap = new Map();
  for (const set of sets) {
    if (!exerciseMap.has(set.exercise_id)) {
      exerciseMap.set(set.exercise_id, set);
    }
  }

  return Array.from(exerciseMap.values()).slice(0, 8);
}

export async function getRecovery(user_id, pagination = { perPage: null, currentPage: null }) {
  return db
    .select(
      'v.id as id',
      'v.stress_level',
      'v.hours_of_sleep',
      'ss.session_rpe',
      'v.created_at',
      'v.user_id as user_id',
    )
    .from('variables as v')
    .leftJoin('sessions as ss', 'ss.id', 'v.session_id')
    .where({ 'v.user_id': user_id })
    .andWhere('v.deleted', false)
    .orderBy('v.created_at', 'desc')
    .paginate({
      ...pagination,
      isLengthAware: true,
    });
}
