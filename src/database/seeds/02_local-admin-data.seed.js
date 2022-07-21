import logger from '../../libs/logger.js';
import * as UsersQueries from '../../apps/api/v1/users/users.queries.js';
import { admin, env } from '../../config/env.js';
import dayjs from 'dayjs';

if (env === 'production') {
  logger.warn('Skipping local admin data seed for production environment!');
  process.exit(0);
}

export async function seed(knex) {
  try {
    const [user] = await UsersQueries.findUserByParam({ email: admin.email });

    // exercise categories
    await knex('exercise_categories').del();
    const ec = await knex('exercise_categories')
      .insert([
        { name: 'Squat', user_id: user.id },
        { name: 'Bench', user_id: user.id },
        { name: 'Deadlift', user_id: user.id },
        { name: 'Press', user_id: user.id },
        { name: 'Quad', user_id: user.id },
        { name: 'Hip and Hamstring', user_id: user.id },
        { name: 'Biceps', user_id: user.id },
        { name: 'Triceps', user_id: user.id },
        { name: 'Rear/Side Delts', user_id: user.id },
        { name: 'Abs and Core', user_id: user.id },
      ])
      .returning('*');

    // exercises
    await knex('exercises').del();
    const e = await knex('exercises')
      .insert([
        // squat
        {
          name: 'high bar squat',
          exercise_category_id: ec[0].id, // squat
          user_id: user.id,
        },
        {
          name: 'low bar squat',
          exercise_category_id: ec[0].id, // squat
          user_id: user.id,
        },
        // bench
        {
          name: 'close grip bench',
          exercise_category_id: ec[1].id, // bench
          user_id: user.id,
        },
        {
          name: 'larsen bench press',
          exercise_category_id: ec[1].id, // bench
          user_id: user.id,
        },
        // deadlift
        {
          name: 'sumo deadlift',
          exercise_category_id: ec[2].id, // deadlift
          user_id: user.id,
        },
        {
          name: 'conventional deadlift',
          exercise_category_id: ec[2].id, // deadlift
          user_id: user.id,
        },
      ])
      .returning('*');

    // blocks
    await knex('blocks').del();
    const b = await knex('blocks')
      .insert([
        {
          name: 'Introduction block',
          description: 'Block to increase work capacity',
          start_date: new Date(),
          end_date: dayjs(new Date()).add(3, 'month'),
          user_id: user.id,
        },
      ])
      .returning('*');

    // sessions
    await knex('sessions').del();
    const s = await knex('sessions')
      .insert([
        {
          name: 'upperbody workout',
          block_id: b[0].id, // block 1
          start_date: new Date(),
          end_date: dayjs(new Date()).add(1, 'hour'),
          body_weight: 185,
          caffeine_intake: 300,
          session_rpe: 7,
          notes: 'this session was super light',
          user_id: user.id,
        },
        {
          name: 'lower body workout',
          block_id: b[0].id, // block 1
          start_date: new Date(),
          body_weight: 135,
          caffeine_intake: 130,
          session_rpe: 3,
          notes: 'this session was super heavy',
          user_id: user.id,
        },
      ])
      .returning('*');

    //   sets
    await knex('sets').del();
    const st = await knex('sets')
      .insert([
        // first session
        {
          user_id: user.id,
          exercise_id: e[0].id,
          session_id: s[0].id,
          reps: 12,
          weight: 225,
          rpe: 7,
          notes: 'this was heavy',
        },
        {
          user_id: user.id,
          exercise_id: e[0].id,
          session_id: s[0].id,
          reps: 11,
          weight: 235,
          rpe: 8,
          notes: 'this was super heavy',
        },
        {
          user_id: user.id,
          exercise_id: e[2].id,
          session_id: s[0].id,
          reps: 5,
          weight: 405,
          rpe: 8,
          notes: 'misgrooved',
        },
        // second session
        {
          user_id: user.id,
          exercise_id: e[1].id,
          session_id: s[1].id,
          reps: 11,
          weight: 235,
          rpe: 8,
          notes: 'this was easy',
        },
      ])
      .returning('*');

    //   gains-meta
    await knex('gains_meta').del();
    const gm = await knex('gains_meta').insert([
      {
        user_id: user.id,
        object: 'exercises',
        object_id: e[0].id,
        json: JSON.stringify({
          collapsed: true,
          exercise_id: e[0].id,
          notes: 'this lift moved well today',
        }),
      },
      {
        user_id: user.id,
        object: 'exercises',
        object_id: e[1].id,
        json: JSON.stringify({
          collapsed: true,
          exercise_id: e[1].id,
          notes: 'this lift moved not today',
        }),
      },
      {
        user_id: user.id,
        object: 'exercises',
        object_id: e[2].id,
        json: JSON.stringify({
          collapsed: true,
          exercise_id: e[2].id,
          notes: 'this lift moved not today',
        }),
      },
    ]);
  } catch (e) {
    logger.error(e);
  }
}
