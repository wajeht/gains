import * as ExerciseCategoriesQueries from './exercise-categories.queries.js';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../../utils/logger.js';
import CustomError from '../../api.errors.js';

/**
 * It fetches all exercise categories from the database and returns them to the client
 * @param req - The request object.
 * @param res - The response object.
 * @returns The exercise categories for a user or all exercise categories.
 */
export async function getExerciseCategories(req, res) {
  const uid = req.query.user_id;
  const all = req.query.all;
  let result = null;

  const is = (key) => {
    return Object.hasOwn(req.query, key);
  };

  switch (true) {
    // when called via /api/v1/exercise-categories?user_id=1&all=true
    case is('user_id') && is('all'):
      result = await ExerciseCategoriesQueries.getAllExerciseCategoriesByUserId(uid); // prettier-ignore
      if (!result.length) throw new CustomError.BadRequestError(`There are no all exercise categories for user id ${uid}!`); // prettier-ignore
      break;

    // when called via /api/v1/exercise-categories?user_id=1
    case is('user_id'):
      result = await ExerciseCategoriesQueries.getExerciseCategoriesByUserId(uid); // prettier-ignore
      if (!result.length) throw new CustomError.BadRequestError(`There are no exercise categories for user id ${uid}!`); // prettier-ignore
      break;

    // when called via /api/v1/exercise-categories
    default:
      result = await ExerciseCategoriesQueries.getAllExerciseCategories();
      if (!result.length) throw new CustomError.BadRequestError(`There are no exercise categories available currently!`); // prettier-ignore
      break;
  }

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: result,
  });
}

/**
 * It creates a new exercise category for a user
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postExerciseCategory(req, res) {
  const body = req.body;
  const created = await ExerciseCategoriesQueries.createExerciseCategory(body);

  if (!created.length) throw new CustomError.BadRequestError(`Something went wrong while creating a exercise categories for  User ID: ${body.user_id}!`); // prettier-ignore

  logger.info(`user id: ${body.user_id} has created a exercise category id: ${created[0].id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}
