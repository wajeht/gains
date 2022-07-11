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
  logger.info(`user ${user[0].id} was created!`);
  res.json(user);
}

/**
 * It's an async function that gets all users from the database and returns them as a JSON object
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getUsers(req, res) {
  const users = await UsersQueries.getAllUsers();
  res.json(users);
}

/**
 * This function gets a user by id and returns it as JSON.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getUser(req, res) {
  const { id } = req.params;
  const user = await UsersQueries.findUserById(id);
  res.json(user);
}

/**
 * This function will update a user by id, and return the updated user.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function patchUser(req, res) {
  const { id } = req.params;
  const user = await UsersQueries.updateUserById(id, req.body);
  res.json(user);
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
  res.json(user);
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

  if (!updated.length) {
    throw CustomError.BadRequestError(
      `Something went wrong while updating personal info for  User ID: ${id}!`,
    );
  }

  logger.info(`UserID: ${id} has updated fields to ${JSON.stringify(body)}!`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: updated,
  });
}
