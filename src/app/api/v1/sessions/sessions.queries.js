import db from '../../../../database/db.js';
import { omit, pick } from 'lodash-es';

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

  await db
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

export function getSessionsByUserId(user_id, pagination = { perPage: null, currentPage: null }) {
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

export async function getSessionBySessionId(sid) {
  let result = null;

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

  const { rows: both } = await db.raw(
    `
      select
        ss.id as id,
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

  if (Object.keys(validVariables).length) {
    await db
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

export async function getAllSessions(pagination = { perPage: null, currentPage: null }) {
  // session sets info
  const { rows: logs } = await db.raw(
    `
    select
      l.*,
      l.id as log_id,
      (select coalesce(jsonb_agg(s.* order by s.id asc) filter (where s.id is not null and s.deleted = false), '[]')) as sets,
      (select coalesce(jsonb_agg(distinct v.*) filter (where v.id is not null and v.deleted = false), '[]')) as videos
    from
      sets s
      full join logs l on l.id = s.log_id
      left join videos v on v.log_id = l.id
      full join sessions ss on ss.id = s.session_id
    where (
      l.deleted = false
      and l.private = false
      and ss.end_date is not null
      and v.deleted = false
    )
    group by
      l.id
    order by
      l.id asc
    `,
  );

  // build tags
  const logIds = logs.map((l) => l.log_id); // grab all ids
  let tags = await Promise.all(logIds.map((l) => db.select('*').from('tags').where({ log_id: l })));
  tags = tags.flat();
  for (const t in tags) {
    const current = tags[t];
    let [s] = logs.filter((s) => s.log_id === current.log_id);
    if (!s.tags) {
      s.tags = [];
      s.tags.push(current);
    } else {
      s.tags.push(current);
    }
  }

  const sessions = await db
    .select(
      'ss.id as id',
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
    sessions.data.forEach((session, _index) => {
      maps[session.session_id] = session;
      maps[`${session.session_id}`]['logs'] = [];
    });
  }

  if (logs.length) {
    logs.forEach((log, _index) => {
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

export async function softDeleteSession(sid, uid) {
  await db.update({ deleted: true }).from('sets').where({ user_id: uid }).andWhere({ session_id: sid }); // prettier-ignore
  await db.update({ deleted: true }).from('variables').where({ user_id: uid }).andWhere({ session_id: sid }); // prettier-ignore
  await db.update({ deleted: true }).from('logs').where({ user_id: uid }).andWhere({ session_id: sid }); // prettier-ignore
  await db.update({ deleted: true }).from('videos').where({ user_id: uid }).andWhere({ session_id: sid }); // prettier-ignore
  await db.update({ deleted: true }).from('comments').where({ user_id: uid }).andWhere({ session_id: sid }); // prettier-ignore
  await db.update({ deleted: true }).from('sets').where({ user_id: uid }).andWhere({ session_id: sid }); // prettier-ignore
  await db.update({ deleted: true }).from('variables').where({ user_id: uid }).andWhere({ session_id: sid }); // prettier-ignore
  return db.update({ deleted: true }).from('sessions').where({ id: sid }).andWhere({ user_id: uid }).returning('*'); // prettier-ignore
}

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
