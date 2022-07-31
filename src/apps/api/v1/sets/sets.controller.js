import * as SetsQueries from './sets.queries.js';
import logger from '../../../../utils/logger.js';
import { StatusCodes } from 'http-status-codes';

/**
 * It creates a set for a user.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postSet(req, res) {
  const body = req.body;
  const created = await SetsQueries.createSet(body);

  if (!created.length) throw new CustomError.BadRequestError(`Something went wrong while creating a set for  User ID: ${body.user_id}!`); // prettier-ignore

  logger.info(`User id: ${body.user_id} has created a set id: ${created[0].id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}

/**
 * It takes in a request object, and a response object, and returns a response object with a status
 * code of 200 and a message that says "The resource was updated successfully!"
 * @param req - The request object.
 * @param res - The response object.
 */
export async function patchSet(req, res) {
  const id = req.params.id;
  const body = req.body;
  const updated = await SetsQueries.updateSetById(body, id);

  if (!updated.length) throw new CustomError.BadRequestError(`Something went wrong while updating a set for user id ${body.user_id} and set id ${body.id}!`); // prettier-ignore

  logger.info(
    `User id: ${body.user_id} has updated a set id: ${updated[0].id} to ${JSON.stringify(
      updated[0],
    )}`,
  );

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: updated,
  });
}

/**
 * It deletes a set by id and returns the deleted set
 * @param req - The request object.
 * @param res - The response object.
 */
export async function deleteSet(req, res) {
  const id = req.params.id;
  const body = req.body;
  const deleted = await SetsQueries.deleteSetById(id, body);

  if (!deleted.length) throw new CustomError.BadRequestError(`Something went wrong while deleting a  set id ${body.id} for user id ${body.user_id} !`); // prettier-ignore

  logger.info(`User id: ${body.user_id} has deleted a set id: ${deleted[0].id})}`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was deleted successfully!',
    data: deleted,
  });
}
