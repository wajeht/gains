import db from '../../../../database/db.js';

/**
 * It takes in a body object, inserts it into the database, and returns the newly created block
 * @param [body] - an object with the following keys: name, description, start_date, end_date, user_id
 * @returns The entire block object
 */
export function createBlock(body = { name, description, start_date, end_date, user_id }) {
  return db.insert(body).into('blocks').returning('*');
}

/**
 * Get the block with the given block id.
 * @param bid - The block id
 * @returns An array of objects
 */
export function getBlockByBlockId(bid) {
  return db.select('*').from('blocks').where({ id: bid });
}

/**
 * Get all blocks for a user.
 * @param uid - the user id of the user you want to get the blocks for
 * @returns An array of objects
 */
export function getBlocksByUserId(uid) {
  return db.select('*').from('blocks').where({ user_id: uid }).orderBy('id', 'desc');
}

/**
 * It returns all the blocks from the database
 * @returns An array of all the blocks in the database.
 */
export function getAllBlocks() {
  return db.select('*').from('blocks');
}
