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
        `  (select coalesce(jsonb_agg(logs.* order by logs.id) filter (where logs.id is not null and logs.deleted = false), '[]') ) as json`,
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
      l.id as log_id,
      (select coalesce(jsonb_agg(s.* order by s.id asc) filter (where s.id is not null and s.deleted = false), '[]')) as sets,
      (select coalesce(jsonb_agg(distinct v.*) filter (where v.id is not null and v.deleted = false), '[]')) as videos
    from
      sets s
      full join logs l on l.id = s.log_id
      full join videos v on v.log_id = l.id
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

  const logIds = sets.map((l) => l.log_id);
  let tags = await Promise.all(logIds.map((l) => db.select('*').from('tags').where({ log_id: l })));
  tags = tags.flat();

  for (const t in tags) {
    const current = tags[t];
    let [s] = sets.filter((s) => s.log_id === current.log_id);
    if (!s.tags) {
      s.tags = [];
      s.tags.push(current);
    } else {
      s.tags.push(current);
    }
  }

  // const { rows: videos } = await db.raw(
  //   `
  //   select
  //     (select coalesce(jsonb_agg(v.*) filter (where v.id is not null and v.deleted = false), '[]')) as videos
  //   from
  //     videos v
  //     inner join logs l on l.id = v.log_id
  //   where
  //     v.session_id = ?
  //   group by
  //     l.id
  // `,
  //   [sid],
  // );

  // // TODO: this is not good for performance
  // // TODO: find a way to merge two queries together
  // sets.forEach((set, idx) => {
  //   // console.log(set);
  //   set.videos = videos[idx]?.videos;
  // });

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

  const { rows: comments } = await db.raw(
    `
    select count(*) as comments
    from comments c
    where (
      c.deleted = false
      and c.session_id = ?
    )
  `,
    [sid],
  );

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
        ss.*,
        b.*,
        v.*,
	      ss.id as "session_id",
	      ss.name as "name",
        u.username as "username",
        ud.profile_picture_url,
	      ss.start_date as "start_date",
	      b.name as "block_name",
	      ss.end_date as "end_date",
	      ss.json as "json"
      from
	      sessions ss
        inner join users u on u.id = ss.user_id
        inner join user_details ud on ud.user_id = u.id
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
      counts_of_comments: Number(comments[0].comments),
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
 * "Get all sessions for a user, and include all videos for each session."
 *
 * The first thing to notice is that we're using the `db.raw` method. This is a method that allows us
 * to write raw SQL queries. We're using it here because we need to use the `jsonb_agg` function, which
 * is a Postgres function that allows us to aggregate a column into a JSON array
 * @param user_id - The user_id of the user whose sessions we want to retrieve.
 * @returns An array of objects. Each object has a session and an array of videos.
 */
export async function sessionsWithVideosByUserId(user_id) {
  const { rows } = await db.raw(
    `
    select
	    ss.*,
	    (select (jsonb_agg(v.* order by v.id))) as videos
    from
	    sessions ss
	    inner join videos v on v.session_id = ss.id
    where (
	    ss.user_id = ?
	    and v.deleted = false
      and ss.deleted = false
    )
    group by
	    ss.id
    order by
	    ss.id desc
    `,
    [user_id],
  );

  return rows;
}

/**
 * Get all sessions, and for each session, get all videos that are not deleted, and order them by id.
 * @returns An array of objects.
 */
export async function getAllSessions(pagination = { perPage: null, currentPage: null }) {
  // session sets info
  // const { rows: logs } = await db.raw(
  //   `
  //   select
  //     l.*,
  //     (select coalesce(jsonb_agg(s.* order by s.id asc) filter (where s.id is not null and s.deleted = false), '[]')) as sets,
  //     (select coalesce(jsonb_agg(distinct v.*) filter (where v.id is not null and v.deleted = false), '[]')) as videos
  //   from
  //     sets s
  //     full join logs l on l.id = s.log_id
  //     full join videos v on v.log_id = l.id
  //     full join sessions ss on ss.id = s.session_id
  //   where (
  //     l.deleted = false
  //     and l.private = false
  //     and ss.end_date is not null
  //     and v.deleted = false
  //   )
  //   group by
  //     l.id
  //   order by
  //     l.id asc
  //   `,
  // );

  const logs = await db
    .select(
      'l.*',
      db.raw(
        `(select distinct coalesce(jsonb_agg(s.* order by s.id asc) filter (where s.id is not null and s.deleted = false), '[]')) as sets`,
      ),
      db.raw(
        `(select coalesce(jsonb_agg(distinct v.*) filter (where v.id is not null and v.deleted = false), '[]')) as videos`,
      ),
      db.raw(
        `(select coalesce(jsonb_agg(distinct t.*) filter (where t.id is not null and t.deleted = false), '[]')) as tags`,
      ),
    )
    .from('sets as s')
    .fullOuterJoin('logs as l', 'l.id', 's.log_id')
    .fullOuterJoin('videos as v', 'v.log_id', 'l.id')
    .fullOuterJoin('tags as t', 't.log_id', 'l.id')
    .fullOuterJoin('sessions as ss', 'ss.id', 's.session_id')
    .whereRaw(
      `
        l.deleted = false
        and t.deleted = false
        and l.private = false
        and ss.end_date is not null
        and v.deleted = false
    `,
    )
    .groupBy('l.id')
    .orderBy('l.id', 'asc');
  // .paginate({
  //   ...pagination,
  // });

  // const { rows: sessions } = await db.raw(
  //   `
  //   select
  //     ss.*,
  //     b.*,
  //     v.*,
  //     u.username,
  //     ud.profile_picture_url,
  //     ss.id as "session_id",
  //     ss.name as "name",
  //     ss.start_date as "start_date",
  //     b.name as "block_name",
  //     ss.end_date as "end_date",
  //     (select count(c.*) filter (where c.deleted = false)) as counts_of_comments,
  //     ss.json as "json"
  //   from
  //     sessions ss
  //     full join blocks b on b.id = ss.block_id
  //     inner join variables v on v.session_id = ss.id
  //     full join comments c on c.session_id = ss.id
  //     inner join users u on u.id = ss.user_id
  //     inner join user_details ud on ud.user_id = u.id
  //   where (
  //     ss.deleted = false
  //     and ss.end_date is not null
  //   )
  //   group by
  //     ss.id,
  //     b.id,
  //     v.id,
  //     u.id,
  //     ud.id
  // `,
  // );

  const sessions = await db
    .select(
      'ss.*',
      'b.*',
      'v.*',
      'u.username',
      'ud.profile_picture_url',
      'ss.id as session_id',
      'ss.name as name',
      'ss.start_date as start_date',
      'b.name as block_name',
      'ss.end_date as end_date',
      db.raw(`(select count(c.*) filter (where c.deleted = false)) as counts_of_comments`),
      'ss.json as json',
    )
    .from('sessions as ss')
    .fullOuterJoin('blocks as b', 'b.id', 'ss.block_id')
    .innerJoin('variables as v', 'v.session_id', 'ss.id')
    .fullOuterJoin('comments as c', 'c.session_id', 'ss.id')
    .innerJoin('users as u', 'u.id', 'ss.user_id')
    .innerJoin('user_details as ud', 'ud.user_id', 'u.id')
    .whereRaw(`ss.deleted = false and ss.end_date is not null`)
    .groupByRaw(
      `
      ss.id,
      b.id,
      v.id,
      u.id,
      ud.id
      `,
    )
    .orderBy('ss.id', 'desc')
    .paginate({
      ...pagination,
    });

  // this is not good for performance, but I cannot figure who to combined complicated sql
  const maps = {};

  if (sessions.data.length) {
    sessions.data.forEach((session, index) => {
      maps[session.session_id] = session;
      maps[`${session.session_id}`]['logs'] = [];
    });
  }

  if (logs.length) {
    logs.forEach((log, index) => {
      // if (!maps[`${log.session_id}`]['logs']) {
      //   maps[`${log.session_id}`]['logs'] = [];
      if (maps[`${log.session_id}`]) {
        maps[`${log.session_id}`].logs.push(log);
      }
      // } else {
      // maps[`${log.session_id}`]['logs'] = [log];
      // maps[`${log.session_id}`]['logs'].push(log);
      // }
    });
  }

  return {
    data: [...Object.values(maps).sort().reverse()],
    // data: [...Object.values(maps).reverse()],
    // data: [...Object.values(maps)],
    pagination: sessions.pagination,
  };
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
  // await db.update({ deleted: true }).from('gains_meta').where({ user_id: uid }).andWhereRaw(`(json->'session_id')::int = ?`, [sid]); // prettier-ignore
  await db.update({ deleted: true }).from('logs').where({ user_id: uid }).andWhere({ session_id: sid }); // prettier-ignore
  await db.update({ deleted: true }).from('videos').where({ user_id: uid }).andWhere({ session_id: sid }); // prettier-ignore
  await db.update({ deleted: true }).from('comments').where({ user_id: uid }).andWhere({ session_id: sid }); // prettier-ignore
  await db.update({ deleted: true }).from('sets').where({ user_id: uid }).andWhere({ session_id: sid }); // prettier-ignore
  await db.update({ deleted: true }).from('variables').where({ user_id: uid }).andWhere({ session_id: sid }); // prettier-ignore
  return db.update({ deleted: true }).from('sessions').where({ id: sid }).andWhere({ user_id: uid }).returning('*'); // prettier-ignore
}

/**
 * It undoes the soft delete of a session by setting the deleted flag to false for all the tables that
 * are associated with a session
 * @returns The session that was undeleted.
 */
export async function undoSoftDeleteSession({ user_id, session_id }) {
  await db.update({ deleted: false }).from('sets').where({ session_id }).andWhere({ user_id}); // prettier-ignore
  await db.update({ deleted: false }).from('variables').where({ session_id }).andWhere({ user_id}); // prettier-ignore
  await db.update({ deleted: false }).from('logs').where({ session_id }).andWhere({ user_id}); // prettier-ignore
  await db.update({ deleted: false }).from('videos').where({ session_id }).andWhere({ user_id}); // prettier-ignore
  await db.update({ deleted: false }).from('comments').where({ session_id }).andWhere({ user_id}); // prettier-ignore
  await db.update({ deleted: false }).from('sets').where({ session_id }).andWhere({ user_id}); // prettier-ignore
  await db.update({ deleted: false }).from('variables').where({ session_id }).andWhere({ user_id}); // prettier-ignore
  return db.update({ deleted: false }).from('sessions').where({ id: sid }).andWhere({ user_id: uid }).returning('*'); // prettier-ignore
}
