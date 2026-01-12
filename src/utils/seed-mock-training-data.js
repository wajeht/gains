import logger from './logger.js';
import { faker } from '@faker-js/faker';
import * as SessionsQueries from '../app/api/v1/sessions/sessions.queries.js';
import * as UsersQueries from '../app/api/v1/users/users.queries.js';
import * as LogsQueries from '../app/api/v1/logs/logs.queries.js';
import * as ExercisesQueries from '../app/api/v1/exercises/exercises.queries.js';
import * as SetsQueries from '../app/api/v1/sets/sets.queries.js';
import * as BlocksQueries from '../app/api/v1/blocks/blocks.queries.js';

const randomBoolean = () => faker.datatype.number({ min: 0, max: 1 }) === 1;

export default async function seedMockTrainingData(email) {
  try {
    const [{ id: user_id }] = await UsersQueries.findUserByParam({ email });

    const blocks = await BlocksQueries.getBlocksByUserId(user_id);
    const exercises = await ExercisesQueries.getExerciseByUserId(user_id);

    for (let k = 0; k < 20; k++) {
      console.log('-'.repeat(process.stdout.columns));

      const sessionObject = {
        name: faker.lorem.words(5),
        body_weight: faker.datatype.number({ max: 225 }),
        caffeine_intake: faker.datatype.number({ max: 300 }),
        calories_prior_session: faker.datatype.number({ max: 1500 }),
        total_calories: faker.datatype.number({ max: 3000 }),
        water_prior_session: faker.datatype.number({ max: 1000 }),
        total_water: faker.datatype.number({ max: 1000 }),
        hours_of_sleep: faker.datatype.number({ max: 8 }),
        stress_level: faker.datatype.number({ max: 10 }),
        notes: faker.lorem.words(10),
        user_id: user_id,
      };

      if (blocks.length && randomBoolean()) {
        const randomBlockLength = blocks.length - 1;
        const randomBlock = faker.datatype.number({ min: 0, max: randomBlockLength });
        sessionObject.block_id = blocks[randomBlock].id;
      }

      const [session] = await SessionsQueries.createASession(sessionObject);
      console.log();
      logger.info(`session ${session.id}: ${session.name}`);
      console.log();

      if (exercises.length < 1) {
        throw new Error(`User: ${user_id || email} does not have enough exercises to generate!`);
      }

      for (let i = 0; i < faker.datatype.number({ max: 10 }); i++) {
        const randomNumberExercise = exercises.length - 1;
        const randomNumber = faker.datatype.number({ min: 0, max: randomNumberExercise });
        const randomExercise = exercises[randomNumber];

        const [log] = await LogsQueries.createLog({
          name: randomExercise.name,
          notes: faker.lorem.words(10),
          user_id: user_id,
          session_id: session.id,
          exercise_id: randomExercise.id,
          collapsed: true,
          private: randomBoolean(),
          sets_notes_visibility: true,
        });

        logger.info(`log ${log.id}: ${randomExercise.name}`);

        for (let j = 0; j < faker.datatype.number({ max: 10 }); j++) {
          const [set] = await SetsQueries.createSet({
            log_id: log.id,
            user_id: log.user_id,
            exercise_id: log.exercise_id,
            session_id: log.session_id,
            notes: faker.lorem.words(10),
            reps: faker.datatype.number({ max: 15 }),
            weight: faker.datatype.number({ max: 500 }),
            rpe: faker.datatype.number({ max: 10 }),
          });

          logger.info(
            ` set ${set.id}: - ${set.reps} x ${set.weight} @${set.rpe} - ${set.notes.split(' ').slice(0, 3).join(' ')}...`,
          );
        }
        logger.info(`log ${log.id} set to ${log.private}`);
        console.log();
      }

      if (randomBoolean()) {
        await SessionsQueries.updateSession(session.id, session.user_id, {
          end_date: faker.date.soon(),
        });
        logger.info(`session ${session.id} set to completed!`);
        console.log();
      }
    }
  } catch (e) {
    logger.error(e);
    throw new Error(e);
  }
}
