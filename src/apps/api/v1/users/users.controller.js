import logger from '../../../../libs/logger.js';
import * as UsersQueries from './users.queries.js';
import Chad from '../../../../libs/chad.js';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../../api.errors.js';

/**
 * check to see if a current users authentication is still valid
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getCheckAuthentication(req, res) {
  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [],
  });
}

/**
 * It creates a user and returns the user
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postUser(req, res) {
  const user = await UsersQueries.createUser(req.body);

  logger.info(`User ${user[0].id} was created!`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: user,
  });
}

/**
 * It's an async function that gets all users from the database and returns them as a JSON object
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getUsers(req, res) {
  const users = await UsersQueries.getAllUsers();

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: users,
  });
}

/**
 * This function gets a user by id and returns it as JSON.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getUser(req, res) {
  const { id } = req.params;
  const user = await UsersQueries.findUserById(id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: user,
  });
}

/**
 * This function will update a user by id, and return the updated user.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function patchUser(req, res) {
  const { id } = req.params;
  const user = await UsersQueries.updateUserById(id, req.body);

  logger.info(`User id ${id} has updated user details to ${JSON.stringify(req.body)}!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: user,
  });
}

/**
 * It takes the id from the request parameters, calls the deleteUser function from the UsersQueries,
 * and returns the result as a JSON response
 * @param req - The request object.
 * @param res - The response object.
 */
export async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await UsersQueries.deleteUser(id);

  logger.info(`UserID: ${id} has disabled their account!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was deleted successfully!',
    data: user,
  });
}

/**
 * It updates the personal information of a user
 * @param req - The request object.
 * @param res - The response object.
 */
export async function patchUpdatePersonalInformation(req, res) {
  const { id } = req.params;
  const body = req.body;
  const updated = await UsersQueries.updatePersonalInformation(id, body);

  if (!updated.length) throw new CustomError.BadRequestError(`Something went wrong while updating personal info for  User ID: ${id}!`); // prettier-ignore

  logger.info(`User id ${id} has updated personal information to ${JSON.stringify(body)}!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: updated,
  });
}

/**
 * It takes in a user's ID and a body of data, and updates the user's account information
 * @param req - The request object.
 * @param res - The response object.
 */
export async function patchUpdateAccountInformation(req, res) {
  const { id } = req.params;
  const body = req.body;
  const updated = await UsersQueries.updateAccountInformation(id, body);

  logger.info(`User id ${id} has updated account information to ${JSON.stringify(body)}!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: updated,
  });
}
