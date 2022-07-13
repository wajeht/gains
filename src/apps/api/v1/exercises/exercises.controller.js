import * as ExercisesQueries from './exercises.queries.js';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../../libs/logger.js';

export async function getExercises(req, res) {
  const uid = req.query.user_id;

  // when called via /api/v1/exercise-categories?user_id=1
  if (uid) {
    const userExercises = await ExercisesQueries.getExerciseByUserId(uid);

    if (!userExercises.length) {
      throw new CustomError.BadRequestError(
        `Something went wrong while fetching userExercises for user id ${uid}!`,
      );
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      data: userExercises,
    });
  }

  // when called via /api/v1/exercises
  const exercises = await ExercisesQueries.getAllExercises();

  if (!exercises.length) throw new CustomError.BadRequestError(`Something went wrong while fetching exercise!`); // prettier-ignore

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: exercises,
  });
}

/**
 * It creates a new exercise for a user
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postExercise(req, res) {
  const body = req.body;
  const created = await ExercisesQueries.createExercise(body);

  if (!created.length) {
    throw new CustomError.BadRequestError(
      `Something went wrong while creating a exercise for  User ID: ${body.user_id}!`,
    );
  }

  logger.info(`User id: ${body.user_id} has created a exercise id: ${created[0].id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}
