import logger from '../../../utils/logger.js';
import * as UsersQueries from '../v1/users/users.queries.js';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../api.errors.js';
import seedMockTrainingData from '../../../utils/seed-mock-training-data.js';

export async function getViewLogs(req, res) {
  res.json({
    msg: 'ok',
  });
}

/**
 * It takes in a user's email address, generates mock training data for that user, and returns a
 * success message
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postSeedMockTrainingData(req, res) {
  const { email } = req.body;

  const mock = await seedMockTrainingData(email);

  const [{ id: user_id }] = await UsersQueries.findUserByParam({ email });

  logger.info(`User ID: ${user_id} has generated mock training data!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [],
  });
}
