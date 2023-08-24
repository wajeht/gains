import db from '../../../../database/db.js';

export function createComment(body) {
  return db.insert(body).into('comments').returning('*');
}

export function getCommentsBySessionId(session_id) {
  return db
    .select('*', 'users.created_at as created_at', 'comments.id as id')
    .from('comments')
    .innerJoin('users', 'users.id', 'comments.user_id')
    .where({ session_id: session_id })
    .andWhere({ 'comments.deleted': false })
    .orderBy('comments.created_at', 'asc');
}

export function getCommentByCommentId(comment_id) {
  return db.select('*').from('comments').where({ id: comment_id }).andWhere({ deleted: false });
}

export function deleteAComment(comment_id) {
  return db.update({ deleted: true }).from('comments').where({ id: comment_id }).returning('*');
}
