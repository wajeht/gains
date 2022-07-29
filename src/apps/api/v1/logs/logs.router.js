import { validator, catchAsyncErrors } from '../../api.middlewares.js';

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

export default logs;
