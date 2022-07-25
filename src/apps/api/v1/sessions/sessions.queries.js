import db from '../../../../database/db.js';

/**
 * It takes a body object, inserts it into the sessions table, and returns the newly created session
 * @param body - an object containing the following properties:
 * @returns The session that was created
 */
export function createASession(body) {
  return db
    .insert({ ...body })
    .into('sessions')
    .returning('*');
}

/**
 * Get all sessions for a given user.
 * @param user_id - The user_id of the user whose sessions you want to retrieve.
 * @returns An array of objects
 */
export function getSessionsByUserId(user_id) {
  return db
    .select('*')
    .from('sessions')
    .where({ user_id })
    .andWhere({ deleted: false })
    .orderBy('id', 'desc');
}

/**
 * ! TODO: instead of multiple db calls, use postgres json_agg func
 * It gets a session by its session id
 * @param sid - The session id
 * @returns An array of objects
 */
export async function getSessionBySessionId(sid) {
  let result = null;

  // session sets info
  const { rows: sets } = await db.raw(
    `
    select
	    e.name as name,
      gm.id as "gains_meta_id",
	    gm.json->'sets_notes_visibility' as "sets_notes_visibility",
	    gm.json->'session_id' as "session_id",
	    gm.json->'exercise_id' as "exercise_id",
	    gm.json->'collapsed' as "collapsed",
	    gm.json->'notes' as "notes",
	    (select json_agg(s.* order by s.id)) as sets
    from
	    sets s
	    inner join exercises e on e.id = s.exercise_id
	    inner join gains_meta gm on (gm.json->'exercise_id')::int = e.id
      inner join sessions ss on ss.id = s.session_id
    where (
        ss.deleted = false
        and (s.session_id = ? and (gm.json->'session_id')::int = ?)
        and s.deleted = false
      )
    group by
	    s.session_id,
	    e.id,
	    gm.id
    order by e.id desc
  `,
    [sid, sid],
  );

  // session with block info
  const joined = await db
    .select(
      '*',
      'sessions.name as name',
      'blocks.name as block_name',
      'sessions.end_date as end_date',
    )
    .from('sessions')
    .innerJoin('blocks', { 'blocks.id': 'sessions.block_id' })
    .where({ 'sessions.id': sid })
    .andWhere({ 'sessions.deleted': false });

  // session without block info
  const notJoined = await db
    .select('*', 'sessions.end_date as end_date')
    .from('sessions')
    .where({ id: sid })
    .andWhere({ deleted: false });

  if (!joined.length) {
    result = [
      {
        ...notJoined[0],
        logs: sets,
      },
    ];
  } else {
    result = [
      {
        ...joined[0],
        logs: sets,
      },
    ];
  }

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
  return db
    .update(body)
    .from('sessions')
    .where({ id: sid })
    .andWhere({ user_id: uid })
    .returning('*');
}

/**
 * Update the session with the given sid and uid to be deleted.
 * @param sid - The session ID
 * @param uid - user id
 * @returns The updated session
 */
export async function softDeleteSession(sid, uid) {
  await db.update({ deleted: true }).from('sets').where({ user_id: uid }).andWhere({ session_id: sid }); // prettier-ignore
  await db.update({ deleted: true }).from('gains_meta').where({ user_id: uid }).andWhereRaw(`(json->'session_id')::int = ?`, [sid]); // prettier-ignore
  return db.update({ deleted: true }).from('sessions').where({ id: sid }).andWhere({ user_id: uid }).returning('*'); // prettier-ignore
}
