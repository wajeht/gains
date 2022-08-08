import db from '../../../../database/db.js';

/**
 * It takes in an object with details about a video, and returns a promise that resolves to an array of
 * objects containing the details of the video that was just inserted
 * @param details - an object containing the details of the video to be inserted
 * @returns The video details
 */
export function insertVideo(details) {
  return db.insert(details).into('videos').returning('*');
}

/**
 * Find a video by its id.
 * @param video_id - The id of the video you want to find.
 * @returns An array of objects
 */
export function findVideoById(video_id) {
  return db.select('*').from('videos').where({ id: video_id });
}
