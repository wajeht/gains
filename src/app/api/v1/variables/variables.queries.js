import db from '../../../../database/db.js';

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
  const { rows } = await db.raw(
    `
    select
	    json_agg(s.*)->0->'id' as "set_id",
	    e.name as "name",
	    json_agg(s.*)->0->'reps' as "reps",
	    json_agg(s.*)->0->'weight' as "weight",
	    json_agg(s.*)->0->'rpe' as "rpe",
	    json_agg(s.*)->0->>'session_id' as "session_id",
	    json_agg(s.*)->0->>'created_at' as "date"
    from
	    sets s
    inner join exercises e on e.id = s.exercise_id
    inner join sessions ss on ss.id = s.session_id
    where (
	    s.reps between 1 and 3
	    and s.rpe between 7 and 10
      and ss.deleted = false
	    and s.user_id = ?
    )
    group by
	    e.id
    order by
	    date desc
    limit 8
  `,
    [user_id],
  );
  return rows;
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
    .fullOuterJoin('sessions as ss', 'ss.id', 'v.session_id')
    .where({ 'v.user_id': user_id })
    .andWhereRaw(`(v.deleted = false or ss.deleted = false)`)
    .orderBy('v.created_at', 'desc')
    .paginate({
      ...pagination,
      isLengthAware: true,
    });
}
