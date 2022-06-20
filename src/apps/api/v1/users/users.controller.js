import * as UsersService from './users.service.js';

/**
 * It creates a user and returns the user
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postUser(req, res) {
  const user = await UsersService.createUser(req.body);
  res.json(user);
}

/**
 * It's an async function that gets all users from the database and returns them as a JSON object
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getUsers(req, res) {
  const users = await UsersService.getAllUsers();
  res.json(users);
}

/**
 * This function gets a user by id and returns it as JSON.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getUser(req, res) {
  const { id } = req.params;
  const user = await UsersService.findUserById(id);
  res.json(user);
}

/**
 * This function will update a user by id, and return the updated user.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function patchUser(req, res) {
  const { id } = req.params;
  const user = await UsersService.updateUserById(id, req.body);
  res.json(user);
}

/**
 * It takes the id from the request parameters, calls the deleteUser function from the UsersService,
 * and returns the result as a JSON response
 * @param req - The request object.
 * @param res - The response object.
 */
export async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await UsersService.deleteUser(id);
  res.json(user);
}
