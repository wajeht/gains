import * as LogsQueries from './logs.queries.js';
import * as VideosQueries from '../videos/videos.queries.js';
import { StatusCodes } from '../../../config/status-codes.js';
import CustomError from '../../api.errors.js';
import logger from '../../../utils/logger.js';
import { uploadToYouTube } from '../../../utils/youtube.js';
import fs from 'fs';

export async function createLogs(req, res) {
  const body = req.body;
  const created = await LogsQueries.createLog(body);

  if (!created.length) throw new CustomError.BadRequestError(`Something went wrong while creating a log for for log id: ${body.user_id}!`); // prettier-ignore

  logger.info(`user id: ${body.user_id} has created a log id: ${created[0].id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}

export async function uploadAVideo(req, res) {
  const { path: video_path } = req.file;
  const { user_id, session_id, exercise_name } = req.body;
  const { log_id } = req.params;

  try {
    const title = exercise_name ? `${exercise_name} - Workout` : 'Workout Video';
    const youtubeData = await uploadToYouTube(user_id, video_path, title);

    const inserted = await VideosQueries.insertVideo({
      user_id,
      log_id,
      session_id,
      youtube_video_id: youtubeData.youtube_video_id,
      youtube_url: youtubeData.youtube_url,
      youtube_embed_url: youtubeData.youtube_embed_url,
      youtube_thumbnail: youtubeData.youtube_thumbnail,
    });

    fs.unlink(video_path, (err) => {
      if (err) logger.error('failed to delete temp video file', { error: err.message });
    });

    logger.info(`User id ${user_id} uploaded video to YouTube: ${youtubeData.youtube_video_id}`);

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was created successfully!',
      data: inserted,
    });
  } catch (err) {
    fs.unlink(video_path, () => {});
    throw err;
  }
}

export async function updatePrivateState(req, res) {
  const { log_id } = req.params;
  const value = req.body.private;

  const updated = await LogsQueries.updatePrivateState(log_id, value);

  logger.info(`User id: ${updated[0].user_id} has updated log id ${log_id} into ${JSON.stringify(req.body)}!`);

  return res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: updated,
  });
}

export async function postMultipleLogs(req, res) {
  const logs = req.body.logs;
  const user_id = req.body.user_id;

  const created = await LogsQueries.createMultipleLogs(logs);

  logger.info(`User id: ${user_id} has created multiple logs to ${JSON.stringify(logs)}!`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: created,
  });
}

export async function deleteALog(req, res) {
  const id = req.params.id;

  const deleted = await LogsQueries.deleteALog(id);

  logger.info(`User id: ${deleted[0].user_id} has deleted a log id: ${deleted[0].id})}`);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was deleted successfully!',
    data: deleted,
  });
}
