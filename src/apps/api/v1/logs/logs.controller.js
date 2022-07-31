import * as LogsQueries from './logs.queries.js';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../../api.errors.js';
import logger from '../../../../utils/logger.js';

/**
 * It creates a log for a user
 * @param req - The request object.
 * @param res - The response object.
 */
export async function createLogs(req, res) {
  const body = req.body;
  const created = await LogsQueries.createLog(body);

  if (!created.length) throw new CustomError.BadRequestError(`Something went wrong while creating a log for for log id: ${body.user_id}!`); // prettier-ignore

  logger.info(`user id: ${body.user_id} has created a log id: ${created[0].id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}
