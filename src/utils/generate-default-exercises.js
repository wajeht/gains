import db from '../database/db.js';
import logger from './logger.js';
import Chad from './chad.js';

const EXERCISES = {
  squat: [
    'high bar squat',
    'low bar squat',
    'front squat',
    'high bar wide stance squat',
    'tempo low bar squat (5/0/0)',
    'low bar pause squat',
  ],
  bench: [
    'close grip bench press (index finger at ring)',
    'wide grip bench press (pinky finger at ring)',
    'medium grip bench press (thumb away from smooth)',
    'medium grip larsen bench press (thumb away from smooth)',
    'close grip feet-up bench press (index finger at ring)',
  ],
  deadlift: [
    'sumo deadlift',
    'conventional deadlift',
    'beltless conventional deadlift',
    '2 inch block conventional deadlift',
    '2 inch deficit conventional deadlift',
    '2 inch off the floor sumo deadlift',
  ],
};

/**
 * It takes a user_id, and inserts the default exercises into the database
 * @param user_id - the user_id of the user you want to generate the default exercises for
 * @returns An array of objects
 */
export default async function generateDefaultExercises(user_id) {
  try {
    // const delete_exercises_categories = await db('exercise_categories').del(); // for testing
    const ec = await db
      .insert(
        Object.keys(EXERCISES).map((e) => {
          return {
            name: e,
            user_id,
          };
        }),
      )
      .into('exercise_categories')
      .returning('*');

    // built exercises
    const built_exercises = ec
      .map((a) => {
        return EXERCISES[a.name].map((b) => {
          return {
            name: b,
            exercise_category_id: a.id,
            user_id,
          };
        });
      })
      .flat();

    // const delete_exercises = await db('exercises').del(); // for testing
    return db.insert(built_exercises).into('exercises').returning('*');
  } catch (e) {
    logger.error(e);
    Chad.flex(e.message, e.stack);
  }
}
