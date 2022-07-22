import * as SetsQueries from './sets.queries.js';
import logger from '../../../../libs/logger.js';
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
