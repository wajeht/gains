import { StatusCodes } from 'http-status-codes';
import logger from '../../../../utils/logger.js';
import CustomError from '../../api.errors.js';
import db from '../../../../database/db.js';
import { calculateE1RM } from '../../../../utils/helpers.js';

import * as ExercisesQueries from './exercises.queries.js';
import * as ExerciseCategoriesQueries from '../exercise-categories/exercise-categories.queries.js';

export async function getExerciseHistory(req, res) {
  const exercise_id = req.params.exercise_id;
  const { perPage, currentPage } = req.query;

  const pagination = {
    perPage: perPage ?? null,
    currentPage: currentPage ?? null,
  };

  const exercise = await ExercisesQueries.getExerciseHistoryByExerciseId(exercise_id, pagination);

  // calculate e1rm
  exercise.data.map((e) => {
    if (e.reps <= 3 && e.rpe >= 7) {
      e.e1RM = calculateE1RM(e.weight, e.rpe, e.reps);
    } else {
      e.e1RM = 0;
    }
  });

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: exercise.data,
    pagination: exercise.pagination,
  });
}

export async function getExercise(req, res) {
  const eid = req.params.eid;

  const exercise = await ExercisesQueries.getExerciseById(eid);

  // if (!exercise.length) throw new CustomError.BadRequestError(`There are no exercise available for exercise id ${eid}!`); // prettier-ignore

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: exercise,
  });
}

export async function getExercises(req, res) {
  const uid = req.query.user_id;
  const ecid = req.query.exercise_category_id;
  const ob = req.query.order_by;

  // when called via /api/v1/exercises?exercise_category_id=1
  if (ecid) {
    const userExercisesByCategory =
      await ExerciseCategoriesQueries.getExercisesByExerciseCategoryId(ecid);

    // if (!userExercisesByCategory.length) throw new CustomError.BadRequestError(`There are no exercises available for category id ${ecid}!`); // prettier-ignore

    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      data: userExercisesByCategory,
    });
  }

  // when called via /api/v1/exercises?user_id=1
  if (uid) {
    let userExercises = null;

    if (ob === 'name') {
      const { rows: temp } = await db.raw(
        `
        select
          ec.id as category_id,
	        ec.name as category_name,
	        json_agg(e.* order by e."name" asc) as exercises
        from
	        exercises e
	        inner join exercise_categories ec on ec.id = e.exercise_category_id
        where
	        e.deleted = false
	        and e.user_id = ?
        group by
	        ec.id
        order by ec."name"
      `,
        [uid],
      );

      userExercises = temp;

      // userExercises = await ExercisesQueries.getExerciseByUserId(uid, {
      //   orderBy: 'name',
      //   direction: 'asc',
      // });
    } else {
      userExercises = await ExercisesQueries.getExerciseByUserId(uid);
    }

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

export async function postExercise(req, res) {
  const body = req.body;

  const e = body.name
    .split(',')
    .filter((curr) => curr.length != 0)
    .map((curr) => {
      return {
        name: curr.trim(),
        exercise_category_id: body.exercise_category_id,
        user_id: body.user_id,
      };
    });

  const created = await ExercisesQueries.createExercise(e);

  if (!created.length) throw new CustomError.BadRequestError(`Something went wrong while creating a exercise for  User ID: ${body.user_id}!`); // prettier-ignore

  logger.info(`User id: ${body.user_id} has created a exercise id: ${created[0].id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}

export async function patchExerciseNote(req, res) {
  const body = req.body;
  const note = await ExercisesQueries.updateExerciseNote(body);

  if (!note.length)
    throw new CustomError.BadRequestError(
      `Something went wrong while updating a note for gmid: ${body.lid}!`,
    );

  logger.info(`User id: ${body.user_id} has updated exercise note to ${JSON.stringify(body)}!`);

  return res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: note,
  });
}
