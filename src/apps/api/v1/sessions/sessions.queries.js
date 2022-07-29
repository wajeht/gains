import db from '../../../../database/db.js';
import { omit, pick, update } from 'lodash-es';

/**
 * It takes a body object, inserts it into the sessions table, and returns the newly created session
 * @param body - an object containing the following properties:
 * @returns The session that was created
 */
export async function createASession(body) {
  const wout = [
    'body_weight',
    'caffeine_intake',
    'calories_prior_session',
    'total_calories',
    'water_prior_session',
    'total_water',
    'hours_of_sleep',
    'stress_level',
  ];

  const cleanSession = omit(body, ...wout);
  const [insertedSession] = await db
    .insert({ ...cleanSession })
    .into('sessions')
    .returning('*');

  const without = [
    'created_at',
    'updated_at',
    'name',
    'json',
    'start_date',
    'notes',
    'end_date',
    'session_rpe',
    'block_id',
    'deleted',
  ];
  const cleanVariables = omit({ ...insertedSession, ...body }, ...without);
  cleanVariables.session_id = cleanVariables.id;
  delete cleanVariables.id;

  const insertedVariables = await db
    .insert({ ...cleanVariables })
    .into('variables')
    .returning('*');

  return [
    {
      ...insertedSession,
      ...body,
    },
  ];
}

/**
 * Get all sessions for a given user.
 * @param user_id - The user_id of the user whose sessions you want to retrieve.
 * @returns An array of objects
 */
export function getSessionsByUserId(user_id, pagination = { perPage: null, currentPage: null }) {
  // const result = db.raw(
  //   `
  //   select
  //     ss.*,
  //     (select json_agg(l.*)) as "json"
  //   from
  //     sessions ss
  //     full join logs l on l.session_id = ss.id
  //   group by
  //     ss.id
  // `,
  // );

  return db
    .select(
      'sessions.*',
      db.raw(
        `  (select coalesce(jsonb_agg(logs.* order by logs.id) filter (where logs.id is not null), '[]') ) as json`,
      ),
    )
    .from('sessions')
    .fullOuterJoin('logs', { 'logs.session_id': 'sessions.id' })
    .where({ 'sessions.user_id': user_id })
    .andWhere({ 'sessions.deleted': false })
    .orderBy('sessions.id', 'desc')
    .groupBy('sessions.id')
    .paginate({
      ...pagination,
    });
}

/**
 * ! TODO: instead of multiple db calls, use postgres json_agg func
 * It gets a session by its session id
 * @param sid - The session id
 * @returns An array of objects
 */
export async function getSessionBySessionId(sid) {
  let result = null;

  // // session sets info
  // const { rows: sets } = await db.raw(
  //   `
  //   select
  //     e.name as name,
  //     gm.id as "gains_meta_id",
  //     gm.json->'sets_notes_visibility' as "sets_notes_visibility",
  //     gm.json->'session_id' as "session_id",
  //     gm.json->'exercise_id' as "exercise_id",
  //     gm.json->'collapsed' as "collapsed",
  //     gm.json->'notes' as "notes",
  //     (select json_agg(s.* order by s.id)) as sets
  //   from
  //     sets s
  //     inner join exercises e on e.id = s.exercise_id
  //     inner join gains_meta gm on (gm.json->'exercise_id')::int = e.id
  //     inner join sessions ss on ss.id = s.session_id
  //   where (
  //       ss.deleted = false
  //       and (s.session_id = ? and (gm.json->'session_id')::int = ?)
  //       and s.deleted = false
  //     )
  //   group by
  //     s.session_id,
  //     e.id,
  //     gm.id
  //   order by e.id desc
  // `,
  //   [sid, sid],
  // );

  // session sets info
  const { rows: sets } = await db.raw(
    `
    select
      l.*,
      (select coalesce(jsonb_agg(s.* order by s.id asc) filter (where s.id is not null and s.deleted = false), '[]') ) as sets
    from
      sets s
      full join logs l on l.id = s.log_id
      full join sessions ss on ss.id = s.session_id
    where (
      l.deleted = false
      and l.session_id = ?
    )
    group by
      l.id
    order by
      l.id asc
    `,
    [sid],
  );

  // // session with block info
  // const joined = await db
  //   .select(
  //     '*',
  //     'sessions.id as session_id',
  //     'sessions.name as name',
  //     'blocks.name as block_name',
  //     'sessions.end_date as end_date',
  //     'sessions.json as json',
  //   )
  //   .from('sessions')
  //   .innerJoin('blocks', { 'blocks.id': 'sessions.block_id' })
  //   .innerJoin('variables', { 'variables.session_id': 'sessions.id' })
  //   .where({ 'sessions.id': sid })
  //   .andWhere({ 'sessions.deleted': false });

  // // session without block info
  // const { rows: notJoined } = await db.raw(
  //   `
  //   select *,
  //         ss.end_date as end_date,
  //         ss.id as session_id,
  //         ss.json as json
  //   from sessions ss
  //   inner join variables v on v.session_id = ss.id
  //   where (
  //     ss.id = ?
  //     and ss.deleted = false
  //   );
  // `,
  //   [sid],
  // );

  // if (!joined.length) {
  //   result = [
  //     {
  //       ...notJoined[0],
  //       logs: sets,
  //     },
  //   ];
  // } else {
  //   result = [
  //     {
  //       ...joined[0],
  //       logs: sets,
  //     },
  //   ];
  // }

  const { rows: both } = await db.raw(
    `
      select
	      *,
	      ss.id as "session_id",
	      ss.name as "name",
	      b.name as "block_name",
	      ss.end_date as "end_date",
	      ss.json as "json"
      from
	      sessions ss
	      full join blocks b on b.id = ss.block_id
	      inner join variables v on v.session_id = ss.id
      where (
        ss.deleted = false
        and ss.id = ?
      )
  `,
    [sid],
  );

  result = [
    {
      ...both[0],
      logs: sets,
    },
  ];

  return result;
}

/**
 * Update a session in the database
 * @param sid - session id
 * @param uid - user id
 * @param body - {
 * @returns The updated session
 */
export async function updateSession(sid, uid, body) {
  const only = [
    'body_weight',
    'caffeine_intake',
    'calories_prior_session',
    'total_calories',
    'water_prior_session',
    'total_water',
    'hours_of_sleep',
    'stress_level',
  ];

  const validVariables = pick(body, only);
  let updatedVariables = null;
  if (Object.keys(validVariables).length) {
    updatedVariables = await db
      .update(validVariables)
      .from('variables')
      .where({ 'variables.session_id': sid })
      .andWhere({ user_id: uid })
      .returning('*');
  }

  const onlySessionColumn = [
    'name',
    'block_id',
    'start_date',
    'end_date',
    'session_rpe',
    'json',
    'deleted',
    'user_id',
  ];

  const validOnlySessionColumn = pick(body, onlySessionColumn);
  const [updatedSession] = await db
    .update(validOnlySessionColumn)
    .from('sessions')
    .where({ id: sid })
    .andWhere({ user_id: uid })
    .returning('*');

  return [
    {
      ...updatedSession,
      ...validVariables,
    },
  ];
}

/**
 * Update the session with the given sid and uid to be deleted.
 * @param sid - The session ID
 * @param uid - user id
 * @returns The updated session
 */
export async function softDeleteSession(sid, uid) {
  await db.update({ deleted: true }).from('sets').where({ user_id: uid }).andWhere({ session_id: sid }); // prettier-ignore
  await db.update({ deleted: true }).from('variables').where({ user_id: uid }).andWhere({ session_id: sid }); // prettier-ignore
  await db.update({ deleted: true }).from('gains_meta').where({ user_id: uid }).andWhereRaw(`(json->'session_id')::int = ?`, [sid]); // prettier-ignore
  return db.update({ deleted: true }).from('sessions').where({ id: sid }).andWhere({ user_id: uid }).returning('*'); // prettier-ignore
}
