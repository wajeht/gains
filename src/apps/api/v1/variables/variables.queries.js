import db from '../../../../database/db.js';

/**
 * Get all bodyweight of a user.
 * @param user_id - the id of the user
 * @returns An array of objects with the body_weight property
 */
export function getAllBodyweightOfAUser(
  user_id,
  pagination = { perPage: null, currentPage: null },
) {
  return db
    .select('id', 'body_weight', 'created_at as date')
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

/**
 * This function returns the last 8 body weights for a given user
 * @param user_id - the user's id
 * @returns An array of objects with the following properties:
 * id, body_weight, date, user_id
 */
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

/**
 * "Get the most recent sets for a user where the reps are between 1 and 3 and the RPE is between 7 and
 * 10."
 *
 * The first thing to notice is that this is a raw query. I'm using the knex.js library to run raw SQL
 * queries. I'm not using the query builder
 * @param user_id - the user's id
 * @returns An array of objects.
 */
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
    .select('v.stress_level', 'v.hours_of_sleep', 'ss.session_rpe', 'v.created_at')
    .from('variables as v')
    .innerJoin('sessions as ss', 'ss.id', 'v.session_id')
    .where({ 'v.user_id': user_id })
    .andWhere({ 'v.deleted': false })
    .andWhere({ 'ss.deleted': false })
    .orderBy('v.created_at', 'asc')
    .paginate({
      ...pagination,
      isLengthAware: true,
    });
}
