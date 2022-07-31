import db from '../../../../database/db.js';

export function insertVideo(details) {
  return db.insert(details).into('videos').returning('*');
}
