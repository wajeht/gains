import logger from '../../utils/logger.js';
import * as UsersQueries from '../../app/api/v1/users/users.queries.js';
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
  } catch (e) {
    logger.error(e);
  }
}
