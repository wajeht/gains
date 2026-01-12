import db from '../../../../database/db.js';
import { pick } from 'lodash-es';

export async function createASession(body) {
  const excludedSessionColumns = [
    'body_weight',
    'caffeine_intake',
    'calories_prior_session',
    'total_calories',
    'water_prior_session',
    'total_water',
    'hours_of_sleep',
    'stress_level',
  ];

  const sessionData = { ...body };
  const sessionInsertData = Object.fromEntries(
    Object.entries(sessionData).filter(([key]) => !excludedSessionColumns.includes(key)),
  );

  const [insertedSession] = await db('sessions').insert(sessionInsertData).returning('*');

  const excludedVariableColumns = [
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

  const variableData = { ...insertedSession, ...body };

  const variableInsertData = Object.fromEntries(
    Object.entries(variableData).filter(([key]) => !excludedVariableColumns.includes(key)),
  );

  variableInsertData.session_id = variableInsertData.id;

  delete variableInsertData.id;

  await db('variables').insert(variableInsertData).returning('*');

  return [
    {
      ...insertedSession,
      ...body,
    },
  ];
}

export async function getSessionsByUserId(
  user_id,
  pagination = { perPage: null, currentPage: null },
) {
  // Get sessions first
  const sessions = await db
    .select('sessions.*')
    .from('sessions')
    .where('sessions.user_id', user_id)
    .andWhere('sessions.deleted', false)
    .orderBy('sessions.id', 'desc')
    .paginate(pagination);

  // Get logs for each session
  for (const session of sessions.data) {
    const logs = await db
      .select('*')
      .from('logs')
      .where('session_id', session.id)
      .andWhere('deleted', false)
      .orderBy('id', 'asc');
    session.json = logs;
  }

  return sessions;
}

export async function getSessionBySessionId(sid) {
  // Get logs with their sets and videos
  const logs = await db
    .select('logs.*')
    .from('logs')
    .where('logs.session_id', sid)
    .andWhere('logs.deleted', false)
    .orderBy('logs.id', 'asc');

  // Get sets and videos for each log
  for (const log of logs) {
    log.log_id = log.id;

    const sets = await db
      .select('*')
      .from('sets')
      .where('log_id', log.id)
      .andWhere('deleted', false)
      .orderBy('id', 'asc');
    log.sets = sets;

    const videos = await db
      .select('*')
      .from('videos')
      .where('log_id', log.id)
      .andWhere('deleted', false);
    log.videos = videos;

    const tags = await db.select('*').from('tags').where('log_id', log.id);
    log.tags = tags;
  }

  // Get comments count
  const [{ count: commentsCount }] = await db('comments')
    .count('* as count')
    .where('session_id', sid)
    .andWhere('deleted', false);

  // Get session with block and variables
  const [sessionData] = await db
    .select(
      'ss.id as id',
      'ss.*',
      'b.*',
      'v.*',
      'ss.id as session_id',
      'ss.name as name',
      'u.username',
      'ud.profile_picture_url',
      'ss.start_date as start_date',
      'b.name as block_name',
      'ss.end_date as end_date',
      'ss.json as json',
    )
    .from('sessions as ss')
    .innerJoin('users as u', 'u.id', 'ss.user_id')
    .innerJoin('user_details as ud', 'ud.user_id', 'u.id')
    .leftJoin('blocks as b', 'b.id', 'ss.block_id')
    .innerJoin('variables as v', 'v.session_id', 'ss.id')
    .where('ss.deleted', false)
    .andWhere('ss.id', sid);

  if (!sessionData) return [];

  return [
    {
      ...sessionData,
      logs,
      counts_of_comments: Number(commentsCount),
    },
  ];
}

export async function updateSession(sid, uid, body) {
  const variableColumns = [
    'body_weight',
    'caffeine_intake',
    'calories_prior_session',
    'total_calories',
    'water_prior_session',
    'total_water',
    'hours_of_sleep',
    'stress_level',
  ];

  const sessionColumns = [
    'name',
    'block_id',
    'start_date',
    'end_date',
    'session_rpe',
    'json',
    'deleted',
    'user_id',
  ];

  const validVariableUpdates = pick(body, variableColumns);
  const validSessionUpdates = pick(body, sessionColumns);

  const updatedData = {};

  if (Object.keys(validVariableUpdates).length) {
    await db('variables')
      .update(validVariableUpdates)
      .where({ session_id: sid, user_id: uid })
      .returning('*');
    Object.assign(updatedData, validVariableUpdates);
  }

  if (Object.keys(validSessionUpdates).length) {
    await db('sessions')
      .update(validSessionUpdates)
      .where({ id: sid, user_id: uid })
      .returning('*');
    Object.assign(updatedData, validSessionUpdates, { user_id: uid });
  }

  return [updatedData];
}

export async function sessionsWithVideosByUserId(user_id) {
  // Get sessions that have videos
  const sessions = await db
    .select('ss.*')
    .from('sessions as ss')
    .innerJoin('videos as v', 'v.session_id', 'ss.id')
    .where('ss.user_id', user_id)
    .andWhere('v.deleted', false)
    .andWhere('ss.deleted', false)
    .groupBy('ss.id')
    .orderBy('ss.id', 'desc');

  // Get videos for each session
  for (const session of sessions) {
    const videos = await db
      .select('*')
      .from('videos')
      .where('session_id', session.id)
      .andWhere('deleted', false)
      .orderBy('id', 'asc');
    session.videos = videos;
  }

  return sessions;
}

export async function getAllSessions(pagination = { perPage: null, currentPage: null }) {
  // Get sessions
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
      'ss.json as json',
    )
    .from('sessions as ss')
    .leftJoin('blocks as b', 'b.id', 'ss.block_id')
    .innerJoin('variables as v', 'v.session_id', 'ss.id')
    .innerJoin('users as u', 'u.id', 'ss.user_id')
    .innerJoin('user_details as ud', 'ud.user_id', 'u.id')
    .where('ss.deleted', false)
    .whereNotNull('ss.end_date')
    .groupBy('ss.id', 'b.id', 'v.id', 'u.id', 'ud.id')
    .orderBy('ss.id', 'desc')
    .paginate(pagination);

  // Get logs, sets, videos, tags, and comment counts for each session
  for (const session of sessions.data) {
    // Get comment count
    const [{ count }] = await db('comments')
      .count('* as count')
      .where('session_id', session.session_id)
      .andWhere('deleted', false);
    session.counts_of_comments = Number(count);

    // Get logs
    const logs = await db
      .select('*')
      .from('logs')
      .where('session_id', session.session_id)
      .andWhere('deleted', false)
      .andWhere('private', false)
      .orderBy('id', 'asc');

    for (const log of logs) {
      log.log_id = log.id;

      const sets = await db
        .select('*')
        .from('sets')
        .where('log_id', log.id)
        .andWhere('deleted', false)
        .orderBy('id', 'asc');
      log.sets = sets;

      const videos = await db
        .select('*')
        .from('videos')
        .where('log_id', log.id)
        .andWhere('deleted', false);
      log.videos = videos;

      const tags = await db.select('*').from('tags').where('log_id', log.id);
      log.tags = tags;
    }

    session.logs = logs;
  }

  return sessions;
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
  await db.update({ deleted: false }).from('sets').where({ session_id }).andWhere({ user_id }); // prettier-ignore
  await db.update({ deleted: false }).from('variables').where({ session_id }).andWhere({ user_id }); // prettier-ignore
  await db.update({ deleted: false }).from('logs').where({ session_id }).andWhere({ user_id }); // prettier-ignore
  await db.update({ deleted: false }).from('videos').where({ session_id }).andWhere({ user_id }); // prettier-ignore
  await db.update({ deleted: false }).from('comments').where({ session_id }).andWhere({ user_id }); // prettier-ignore
  await db.update({ deleted: false }).from('sets').where({ session_id }).andWhere({ user_id }); // prettier-ignore
  await db.update({ deleted: false }).from('variables').where({ session_id }).andWhere({ user_id }); // prettier-ignore
  return db.update({ deleted: false }).from('sessions').where({ id: session_id }).andWhere({ user_id }).returning('*'); // prettier-ignore
}
