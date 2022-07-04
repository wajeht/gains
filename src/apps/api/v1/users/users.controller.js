import logger from '../../../../libs/logger.js';
import * as UsersQueries from './users.queries.js';
import Chad from '../../../../libs/chad.js';

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
