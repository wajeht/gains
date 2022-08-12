import { validator, catchAsyncErrors } from '../../api.middlewares.js';
import { uploadVideo } from '../../../../utils/multer.js';

import * as LogsValidation from './logs.validation.js';
import * as LogsController from './logs.controller.js';

import express from 'express';
const logs = express.Router();

/**
 * POST /api/v1/logs
 * @tags logs
 * @summary create a log for a session
 * @param {string} name.form.required - the name of the log - application/x-www-form-urlencoded
 * @param {number} session_id.form.required - current session_id - application/x-www-form-urlencoded
 * @param {number} user_id.form.required  - current session_id - application/x-www-form-urlencoded
 * @param {string} notes.form.required- notes for current session - application/x-www-form-urlencoded
 * @param {json} json.form.required- - the json - application/x-www-form-urlencoded
 */
logs.post('/', validator(LogsValidation.createLogs), catchAsyncErrors(LogsController.createLogs));

/**
 * POST /api/v1/logs/multiple
 * @tags logs
 * @summary create a multiple logs at once
 * @param {number} session_id.form.required - current session_id - application/x-www-form-urlencoded
 * @param {number} user_id.form.required  - current session_id - application/x-www-form-urlencoded
 * @param {array} logs.form.required- - the logs - application/x-www-form-urlencoded
 */
logs.post(
  '/multiple',
  validator(LogsValidation.postMultipleLogs),
  catchAsyncErrors(LogsController.postMultipleLogs),
);

/**
 * POST /api/v1/logs/{log_id}/upload-a-video
 * @tags logs
 * @summary add a video to a log
 * @param {number} log_id.form.required - the name of the log - application/x-www-form-urlencoded
 * @param {number} user_id.form.required  - current session_id - application/x-www-form-urlencoded
 */
logs.post(
  '/:log_id/upload-a-video',
  uploadVideo,
  validator(LogsValidation.uploadAVideo),
  catchAsyncErrors(LogsController.uploadAVideo),
);

/**
 * POST /api/v1/logs/{log_id}/update-private-state
 * @tags logs
 * @summary set if a log is private or not
 * @param {number} log_id.form.required - the name of the log - application/x-www-form-urlencoded
 * @param {boolean} private.form.required  - private value - application/x-www-form-urlencoded
 */
logs.patch(
  '/:log_id/update-private-state',
  validator(LogsValidation.updatePrivateState),
  catchAsyncErrors(LogsController.updatePrivateState),
);

export default logs;
