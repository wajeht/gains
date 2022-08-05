import * as LogsQueries from './logs.queries.js';
import * as VideosQueries from '../videos/videos.queries.js';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../../api.errors.js';
import logger from '../../../../utils/logger.js';
import { capture } from '../../../../utils/screenshot.js';

/**
 * It creates a log for a user
 * @param req - The request object.
 * @param res - The response object.
 */
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

/**
 * It uploads a video to the server and inserts the video's path and url into the database
 * @param req - The request object.
 * @param res - The response object.
 */
export async function uploadAVideo(req, res) {
  const { path: video_path } = req.file;
  const video_url = req.file.path.split('public')[1];
  const { user_id, session_id } = req.body;
  const { log_id } = req.params;
  const { screenshot_url, screenshot_path } = await capture(video_path);

  const inserted = await VideosQueries.insertVideo({
    video_path,
    video_url,
    user_id,
    log_id,
    screenshot_path,
    screenshot_url,
    session_id,
  });

  logger.info(`User id ${user_id} has inserted video id ${inserted[0].id} !`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: inserted,
  });
}

/**
 * It updates the private state of a log.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The updated log
 */
export async function updatePrivateState(req, res) {
  const { log_id } = req.params;
  const value = req.body.private;

  const updated = await LogsQueries.updatePrivateState(log_id, value);

  logger.info(`User id: ${updated[0].user_id} has updated log into ${JSON.stringify(req.body)}!`);

  return res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was updated successfully!',
    data: updated,
  });
}
