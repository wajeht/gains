import db from '../../../../database/db.js';
import logger from '../../../../libs/logger.js';
import { red } from '../../../../utils/rainbow-log.js';
import { pick, omit } from 'lodash-es';

/**
 * Get all users from the database.
 * @returns An array of objects
 */
export function getAllUsers() {
  return db.select('*').from('users').leftJoin('user_details', 'users.id', 'user_details.user_id');
}

/**
 * Insert the body into the users table and return all columns.
 * @param {object} body - an object containing the user's information
 * @param {object} body.any - any
 * @returns The user object
 */
export async function createUser(body, verificationToken) {
  return db
    .insert({ ...body })
    .into('users')
    .returning('*')
    .then(async ([user]) => {
      const { id } = user;
      const userDetails = await db
        .insert({ user_id: id, verification_token: verificationToken })
        .into('user_details');
      return db
        .select()
        .from('users')
        .leftJoin('user_details', 'users.id', 'user_details.user_id')
        .where({ 'users.id': id });
    });
}

/**
 * Find a user by their id.
 * @param {number}id - The id of the user we want to find.
 * @returns {array<{}>} An array of objects
 */
export function findUserById(id) {
  return db
    .select('*')
    .from('users')
    .leftJoin('user_details', 'users.id', 'user_details.user_id')
    .where({ 'users.id': id });
}

/**
 * Find a user by a given parameter.
 * @param {object} param - The parameter to search for.
 * @returns {array<{}>} An array of objects
 */
export function findUserByParam(param) {
  return db
    .select('*')
    .from('users')
    .leftJoin('user_details', 'users.id', 'user_details.user_id')
    .where(param);
}

/**
 * Update the user with the given id with the given body and return the updated user.
 * @param {number} id - the id of the user you want to update
 * @param {object} body - an object containing the keys and values to be updated
 * @param {object} body.any - any
 * @returns The updated user object
 */
export async function updateUserById(id, body) {
  const userFields = ['username', 'email', 'password'];

  const u = pick(body, ...userFields);

  await db
    .update({ ...u, updated_at: new Date() })
    .from('users')
    .where({ id });

  const ud = omit(body, ...userFields);

  await db
    .update({ ...ud, updated_at: new Date() })
    .from('user_details')
    .where({ id });

  return findUserById(id);
}

/**
 * It deletes a user from the database and returns the deleted user
 * @param {number} id - The id of the user to delete.
 * @returns The user that was deleted
 */
export function deleteUser(id) {
  return db.delete('*').from('users').where({ id }).returning('*');
}
/* Validating the user input. */
