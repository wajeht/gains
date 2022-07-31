import * as GainsMetaQueries from './gains-meta.queries.js';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../../utils/logger.js';
import CustomError from '../../api.errors.js';

/**
 * It creates a new gains meta info record in the database.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postMeta(req, res) {
  const body = req.body;

  // const json = JSON.stringify({
  //   exercise_id: 3,
  //   session_id: 1,
  //   collapsed: true,
  //   notes: 'this is some notes',
  // });
  // body.json = json;

  const created = await GainsMetaQueries.createGainsMeta(body);

  if (!created.length) throw new CustomError.BadRequestError(`Something went wrong while creating gains meta info for user id: ${created[0].user_id}!`); // prettier-ignore

  logger.info(`Gains meta ${created[0].id} was created!`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}
