import logger from './logger.js';
import Chad from './chad.js';
import redis from './redis.js';
import { sleep } from './helpers.js';
import { faker } from '@faker-js/faker';
import chalk from 'chalk';
import copyMockVideos from './copy-mock-videos.js';
import * as SessionsQueries from '../apps/api/v1/sessions/sessions.queries.js';
import * as CacheQueries from '../apps/api/v1/cache/cache.queries.js';
import * as UsersQueries from '../apps/api/v1/users/users.queries.js';
import * as VideosQueries from '../apps/api/v1/videos/videos.queries.js';
import * as LogsQueries from '../apps/api/v1/logs/logs.queries.js';
import * as ExercisesQueries from '../apps/api/v1/exercises/exercises.queries.js';
import * as SetsQueries from '../apps/api/v1/sets/sets.queries.js';
import * as BlocksQueries from '../apps/api/v1/blocks/blocks.queries.js';

const randomBoolean = () => faker.datatype.number({ min: 0, max: 1 }) === 1;

export default async function seedMockTrainingData(email) {
  try {
    const [{ id: user_id }] = await UsersQueries.findUserByParam({ email });
    const copiedVideos = await copyMockVideos();

    const blocks = await BlocksQueries.getBlocksByUserId(user_id);

    // generate 20 sessions at a time
    for (let k = 0; k < 20; k++) {
      console.log('-'.repeat(process.stdout.columns));
      // generate a session

      const randomBlockLength = blocks.length - 1;
      const randomBlock = faker.datatype.number({ max: randomBlockLength });

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
        sessionObject.block_id = blocks[randomBlock].id;
      }

      const [session] = await SessionsQueries.createASession(sessionObject);
      console.log();
      logger.info(`session ${session.id}: ${session.name}`);
      console.log();

      // generate a exercise
      const exercises = await ExercisesQueries.getExerciseByUserId(user_id);

      if (exercises.length < 2) {
        throw new Error(`User: ${user_id || email} does not have enough exercises to generate!`);
      }

      // generate a log
      for (let i = 0; i < faker.datatype.number({ max: 10 }); i++) {
        const randomNumberExercise = exercises.length - 1;
        const randomNumber = faker.datatype.number({ max: randomNumberExercise });
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

        // ----------------- video starts ---------------------
        const randomNumberForVideoLength = Object.keys(copiedVideos).length - 1;
        const randomNumberForVideo = faker.datatype.number({ max: randomNumberForVideoLength}); // prettier-ignore
        const randomVideo = copiedVideos[Object.keys(copiedVideos)[randomNumberForVideo]];
        const splitAtUpload = (path) => `/uploads${path.split('uploads')[1]}`;

        const insertedVideo = await VideosQueries.insertVideo({
          video_path: randomVideo.video,
          video_url: splitAtUpload(randomVideo.video),
          screenshot_path: randomVideo.screenshot,
          screenshot_url: splitAtUpload(randomVideo.screenshot),
          session_id: session.id,
          log_id: log.id,
          user_id,
        });
        // ----------------- video ends ---------------------

        // logger.info(`generating a log for exercise: ${log}`);

        // generate sets for log above
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
            ` set ${set.id}: - ${set.reps} x ${set.weight} @${set.rpe} - ${set.notes
              .split(' ')
              .slice(0, 3)
              .join(' ')}...`,
          );
        }
        logger.info(`log ${log.id} set to ${log.private}`);
        console.log();
      }

      // complete the session
      if (randomBoolean()) {
        const completeSession = await SessionsQueries.updateSession(session.id, session.user_id, {
          end_date: faker.date.soon(),
        });
        logger.info(`session ${session.id} set to completed!`);
        console.log();
      }
    }

    // clear all the cache
    await redis.flushall();
  } catch (e) {
    logger.error(e);
    throw new Error(e);
  }
}
