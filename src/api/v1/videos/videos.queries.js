import db from '../../../../database/db.js';

export function insertVideo(details) {
  return db.insert(details).into('videos').returning('*');
}

export function findVideoById(video_id) {
  return db.select('*').from('videos').where({ id: video_id });
}
