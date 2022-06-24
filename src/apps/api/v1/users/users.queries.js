import db from '#database/db.js';

/**
 * Get all users from the database.
 * @returns An array of objects
 */
export function getAllUsers() {
  return db.select('*').from('users');
}

/**
 * Insert the body into the users table and return all columns.
 * @param {object} body - an object containing the user's information
 * @param {object} body.any - any
 * @returns The user object
 */
export function createUser(body) {
  return db
    .insert({ ...body })
    .into('users')
    .returning('*');
}

/**
 * Find a user by their id.
 * @param {number}id - The id of the user we want to find.
 * @returns {array<{}>} An array of objects
 */
export function findUserById(id) {
  return db.select('*').from('users').where({ id });
}

/**
 * Find a user by a given parameter.
 * @param {object} param - The parameter to search for.
 * @returns {array<{}>} An array of objects
 */
export function findUserByParam(param) {
  return db.select('*').from('users').where({ param });
}

/**
 * Update the user with the given id with the given body and return the updated user.
 * @param {number} id - the id of the user you want to update
 * @param {object} body - an object containing the keys and values to be updated
 * @param {object} body.any - any
 * @returns The updated user object
 */
export function updateUserById(id, body) {
  return db
    .update({ ...body })
    .from('users')
    .where({ id })
    .returning('*');
}

/**
 * It deletes a user from the database and returns the deleted user
 * @param {number} id - The id of the user to delete.
 * @returns The user that was deleted
 */
export function deleteUser(id) {
  return db.delete().from('users').where({ id }).returning('*');
}
