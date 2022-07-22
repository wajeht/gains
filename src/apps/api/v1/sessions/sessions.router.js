import { validator, catchAsyncErrors } from '../../api.middlewares.js';
import * as SessionsController from './sessions.controller.js';
import * as SessionsValidation from './sessions.validation.js';

import express from 'express';
const sessions = express.Router();

/**
 * POST /api/v1/sessions
 * @tags sessions
 * @summary create a session to start logging
 * @param {number} id.form.required - the user id  - application/x-www-form-urlencoded
 * @param {string} name.form - the name - application/x-www-form-urlencoded
 * @param {number} block_id.form - the block_id - application/x-www-form-urlencoded
 * @param {date} start_date.form - the start_date - application/x-www-form-urlencoded
 * @param {date} end_date.form - the end_date - application/x-www-form-urlencoded
 * @param {string} body_weight.form - the body_weight - application/x-www-form-urlencoded
 * @param {number} hours_of_sleep.form - the hours_of_sleep - application/x-www-form-urlencoded
 * @param {number} calories_prior_session.form - the calories_prior_session - application/x-www-form-urlencoded
 * @param {number} caffeine_intake.form - the caffeine_intake - application/x-www-form-urlencoded
 * @param {number} session_rpe.form - the session_rpe - application/x-www-form-urlencoded
 * @param {string} notes.form - the notes - application/x-www-form-urlencoded
 */
sessions.post(
  '/',
  validator(SessionsValidation.postCreateSession),
  catchAsyncErrors(SessionsController.postCreateSession),
);

/**
 * GET /api/v1/sessions/{sid}
 * @tags sessions
 * @summary get a sessions details
 * @param {number} sid.path.required - the session id  - application/x-www-form-urlencoded
 */
sessions.get(
  '/:sid',
  validator(SessionsValidation.getSession),
  catchAsyncErrors(SessionsController.getSession),
);

/**
 * PATCH /api/v1/sessions/{sid}
 * @tags sessions
 * @summary update session info
 * @param {number} sid.path.required - the session id  - application/x-www-form-urlencoded
 * @param {number} user_id.form - the user_id - application/x-www-form-urlencoded
 * @param {string} name.form - the session name - application/x-www-form-urlencoded
 * @param {number} block_id.form - the block_id - application/x-www-form-urlencoded
 * @param {date} start_date.form - the start_date - application/x-www-form-urlencoded
 * @param {date} end_date.form - the end_date - application/x-www-form-urlencoded
 * @param {string} body_weight.form - the body_weight - application/x-www-form-urlencoded
 * @param {number} hours_of_sleep.form - the hours_of_sleep - application/x-www-form-urlencoded
 * @param {number} caffeine_intake.form - the caffeine_intake - application/x-www-form-urlencoded
 * @param {number} session_rpe.form - the session_rpe - application/x-www-form-urlencoded
 * @param {string} notes.form - the notes - application/x-www-form-urlencoded
 */
sessions.patch(
  '/:sid',
  validator(SessionsValidation.patchSession),
  catchAsyncErrors(SessionsController.patchSession),
);

/**
 * GET /api/v1/sessions?user_id={uid}
 * @tags sessions
 * @summary get all sessions of a user
 * @param {number} uid.path.required - the user id  - application/x-www-form-urlencoded
 */
sessions.get(
  '/',
  validator(SessionsValidation.getUserSessions),
  catchAsyncErrors(SessionsController.getUserSessions),
);

/**
 * DELETE /api/v1/sessions/{sid}
 * @tags sessions
 * @summary delete a session
 * @param {number} sid.path.required - the session id  - application/x-www-form-urlencoded
 * @param {number} user_id.form.required - the user id  - application/x-www-form-urlencoded
 */
sessions.delete(
  '/:sid',
  validator(SessionsValidation.deleteSession),
  catchAsyncErrors(SessionsController.deleteSession),
);

export default sessions;
