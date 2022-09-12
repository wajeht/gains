import db from '../../../../database/db.js';
import logger from '../../../../utils/logger.js';
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
  return db.select('*').from('users').where(param);
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
  // return db.delete('*').from('users').where({ id }).returning('*');
  return db.update({ deleted: true }).from('users').where({ id }).returning('*');
}

/**
 * Update the user_details table with the body object where the user_id is equal to the uid
 * @param uid - The user id of the user whose information is being updated.
 * @param body - {
 * @returns A promise
 */
export function updatePersonalInformation(uid, body) {
  return db
    .update({ ...body })
    .from('user_details')
    .where({ user_id: uid })
    .returning('*');
}

/**
 * It updates the user's account information in the database
 * @param id - the id of the user you want to update
 * @param body - an object containing the updated information
 * @returns The updated user information
 */
export function updateAccountInformation(id, body) {
  return db
    .update({ ...body })
    .from('users')
    .where({ id })
    .returning('*');
}

/**
 * Update the profile picture path and url in the user_details table where the user_id matches the
 * user_id passed in
 * @returns The updated user_details row.
 */
export function updateProfilePicture({ profile_picture_url, profile_picture_path, user_id }) {
  return db
    .update({ profile_picture_path, profile_picture_url })
    .from('user_details')
    .where({ user_id })
    .returning('*');
}

/**
 * It deletes all the data associated with a user
 * @param user_id - The user's id
 * @returns An array of promises.
 */
export function deleteUserData(user_id) {
  return Promise.all([
    db.update({ deleted: true }).from('comments').where({ user_id }).returning('*'),
    db.update({ deleted: true }).from('videos').where({ user_id }).returning('*'),
    db.update({ deleted: true }).from('variables').where({ user_id }).returning('*'),
    db.update({ deleted: true }).from('sets').where({ user_id }).returning('*'),
    db.update({ deleted: true }).from('logs').where({ user_id }).returning('*'),
    db.update({ deleted: true }).from('sessions').where({ user_id }).returning('*'),
    db.update({ deleted: true }).from('blocks').where({ user_id }).returning('*'),
  ]);
}

/**
 * It restores all the data for a user that has been deleted
 * @param user_id - the user's id
 * @returns An array of promises.
 */
export function restoreUserData(user_id) {
  return Promise.all([
    db.update({ deleted: false }).from('comments').where({ user_id }).returning('*'),
    db.update({ deleted: false }).from('videos').where({ user_id }).returning('*'),
    db.update({ deleted: false }).from('variables').where({ user_id }).returning('*'),
    db.update({ deleted: false }).from('sets').where({ user_id }).returning('*'),
    db.update({ deleted: false }).from('logs').where({ user_id }).returning('*'),
    db.update({ deleted: false }).from('sessions').where({ user_id }).returning('*'),
    db.update({ deleted: false }).from('blocks').where({ user_id }).returning('*'),
  ]);
}
