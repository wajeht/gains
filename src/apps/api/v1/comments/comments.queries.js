import db from '../../../../database/db.js';

/**
 * It takes a comment body, inserts it into the database, and returns the newly created comment
 * @param body - an object containing the following keys:
 * @returns The entire row of the comment that was just created.
 */
export function createComment(body) {
  return db.insert(body).into('comments').returning('*');
}

/**
 * Get all comments for a given session id, and join the user table to get the user's name.
 * @param session_id - the id of the session that the comments are associated with
 * @returns An array of objects.
 */
export function getCommentsBySessionId(session_id) {
  return db
    .select('*', 'users.created_at as created_at', 'comments.id as id')
    .from('comments')
    .innerJoin('users', 'users.id', 'comments.user_id')
    .where({ session_id: session_id })
    .andWhere({ 'comments.deleted': false })
    .orderBy('comments.created_at', 'asc');
}

/**
 * This function returns a promise that resolves to an array of objects, each of which represents a
 * comment with the given comment_id.
 * @param comment_id - the id of the comment you want to retrieve
 * @returns An array of objects
 */
export function getCommentByCommentId(comment_id) {
  return db.select('*').from('comments').where({ id: comment_id }).andWhere({ deleted: false });
}

/**
 * It updates the deleted column of the comments table to true where the id is equal to the comment_id
 * argument, and returns the updated comment
 * @param comment_id - the id of the comment to be deleted
 * @returns The updated comment
 */
export function deleteAComment(comment_id) {
  return db.update({ deleted: true }).from('comments').where({ id: comment_id }).returning('*');
}
