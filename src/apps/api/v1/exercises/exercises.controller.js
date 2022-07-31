import { StatusCodes } from 'http-status-codes';
import logger from '../../../../utils/logger.js';
import CustomError from '../../api.errors.js';

import * as ExercisesQueries from './exercises.queries.js';
import * as ExerciseCategoriesQueries from '../exercise-categories/exercise-categories.queries.js';
import { omit } from 'lodash-es';

/**
 * It gets an exercise by its id
 * @param req - The request object.
 * @param res - The response object.
 * @returns The exercise with the given id.
 */
export async function getExercise(req, res) {
  const eid = req.params.eid;

  const exercise = await ExercisesQueries.getExerciseById(eid);

  if (!exercise.length) throw new CustomError.BadRequestError(`There are no exercise available for exercise id ${eid}!`); // prettier-ignore

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: exercise,
  });
}

/**
 * It returns all exercises, exercises by user id, or exercises by exercise category id
 * @param req - The request object.
 * @param res - The response object.
 * @returns the exercises for a specific user or exercise category.
 */
export async function getExercises(req, res) {
  const uid = req.query.user_id;
  const ecid = req.query.exercise_category_id;

  // when called via /api/v1/exercises?exercise_category_id=1
  if (ecid) {
    const userExercisesByCategory =
      await ExerciseCategoriesQueries.getExercisesByExerciseCategoryId(ecid);

    if (!userExercisesByCategory.length) throw new CustomError.BadRequestError(`There are no exercises available for category id ${ecid}!`); // prettier-ignore

    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      data: userExercisesByCategory,
    });
  }

  // when called via /api/v1/exercises?user_id=1
  if (uid) {
    const userExercises = await ExercisesQueries.getExerciseByUserId(uid);

    if (!userExercises.length) throw new CustomError.BadRequestError(`There are no exercises available for user id ${uid}!`); // prettier-ignore

    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      data: userExercises,
    });
  }

  // when called via /api/v1/exercises
  const exercises = await ExercisesQueries.getAllExercises();

  if (!exercises.length) throw new CustomError.BadRequestError(`There are no exercises available currently!`); // prettier-ignore

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

  if (!created.length) throw new CustomError.BadRequestError(`Something went wrong while creating a exercise for  User ID: ${body.user_id}!`); // prettier-ignore

  logger.info(`User id: ${body.user_id} has created a exercise id: ${created[0].id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}

/**
 * It updates a note for a specific exercise.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The updated note.
 */
export async function patchExerciseNote(req, res) {
  const body = req.body;
  const note = await ExercisesQueries.updateExerciseNote(body);

  if (!note.length)
    throw new CustomError.BadRequestError(
      `Something went wrong while updating a note for gmid: ${body.lid}!`,
    );

  logger.info(`User id: ${body.user_id} has updated gains meta to ${JSON.stringify(body)}!`);

  return res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: note,
  });
}
