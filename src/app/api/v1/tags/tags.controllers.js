import { StatusCodes } from 'http-status-codes';
import * as TagsQueries from './tags.queries.js';
import logger from '../../../../utils/logger.js';

export async function postTag(req, res) {
  const body = req.body;
  const created = await TagsQueries.createATag(body);

  if (!created.length) throw new CustomError.BadRequestError(`Something went wrong while creating a set for  User ID: ${body.user_id}!`); // prettier-ignore

  logger.info(`User id: ${body.user_id} has created a tag id: ${created[0].id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}
