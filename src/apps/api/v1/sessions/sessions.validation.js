import * as UserQueries from '../users/users.queries.js';
import * as SessionsQueries from '../sessions/sessions.queries.js';

import { check, param, body, query } from 'express-validator';
import { isEqual } from 'lodash-es';

export const postCreateSession = [
  body().custom((data) => {
    const availableFields = [
      'user_id',
      'name',
      'block_id',
      'start_date',
      'end_date',
      'body_weight',
      'hours_of_sleep',
      'caffeine_intake',
      'calories_prior_session',
      'session_rpe',
      'notes',
    ];
    const fields = Object.keys(data).some((key) => availableFields.indexOf(key) >= 0);
    if (!fields) throw new Error(`Must include ${availableFields.join(', ')} to update!`);
    return true;
  }),
  body('user_id')
    .trim()
    .notEmpty()
    .withMessage('User id must not be empty!')
    .isInt()
    .withMessage('User id must be an number!')
    .custom(async (user_id) => {
      if (user_id) {
        const user = await UserQueries.findUserById(user_id);
        if (user.length === 0) throw new Error('User does not exist!');
      }
      return true;
    })
    .toInt(),
  body('name').trim().notEmpty().withMessage('Session name must not be empty!'),
  body('start_date')
    .trim()
    .notEmpty()
    .withMessage('Start date must not be empty!')
    .isISO8601()
    .toDate()
    .withMessage('Start date must be in date format'),
  body('end_date')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('End date must not be empty!')
    .isISO8601()
    .toDate()
    .withMessage('End date must be in date format'),
  body('block_id')
    .optional()
    .trim()
    .isFloat()
    .withMessage('Block ID must be an integer format!')
    .toFloat(),
  body('body_weight')
    .optional()
    .trim()
    .isFloat()
    .withMessage('Body weight must be an integer format!')
    .toFloat(),
  body('hours_of_sleep')
    .optional()
    .trim()
    .isFloat()
    .withMessage('Hours of sleep must be an integer format!')
    .toFloat(),
  body('session_rpe')
    .optional()
    .trim()
    .isFloat()
    .withMessage('Session RPE must be an integer format!')
    .toFloat(),
  body('calories_prior_session')
    .optional()
    .trim()
    .isFloat()
    .withMessage('calories_prior_session must be an integer format!')
    .toFloat(),
  body('caffeine_intake')
    .optional()
    .trim()
    .isFloat()
    .withMessage('caffeine_intake must be an integer format!')
    .toFloat(),
  body('notes')
    .optional()
    .trim()
    .isLength({ min: 1, max: 250 })
    .withMessage('Notes must be at least 1 character long or less than 250 characters long'),
];

export const getUserSessions = [
  query('perPage')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('perPage must not be empty!')
    .bail()
    .isInt()
    .withMessage('perPage must be an ID!')
    .bail()
    .toInt(),
  query('currentPage')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('current-page must not be empty!')
    .bail()
    .isInt()
    .withMessage('current-page must be an ID!')
    .bail()
    .toInt(),
  query('user_id')
    .trim()
    .notEmpty()
    .withMessage('user_id must not be empty!')
    .isInt()
    .withMessage('user_id must be an ID!')
    .custom(async (value) => {
      const user = await UserQueries.findUserById(value);
      if (user.length === 0) throw new Error('user_id does not exist!');
      return true;
    })
    .toInt(),
];

export const getSession = [
  param('sid')
    .trim()
    .notEmpty()
    .withMessage('The value must not be empty!')
    .isInt()
    .withMessage('The value must be an ID!')
    .custom(async (sid) => {
      const user = await SessionsQueries.getSessionBySessionId(sid);
      if (user.length === 0) throw new Error('session id does not exist!');
      return true;
    })
    .toInt(),
];

export const deleteSession = [
  param('sid')
    .trim()
    .notEmpty()
    .withMessage('The session id must not be empty!')
    .isInt()
    .withMessage('The session id must be an integer!')
    .custom(async (sid) => {
      const user = await SessionsQueries.getSessionBySessionId(sid);
      if (user.length === 0) throw new Error('session id does not exist!');
      return true;
    })
    .toInt(),
];

export const patchSession = [
  body().custom((data) => {
    const availableFields = [
      'name',
      'block_id',
      'start_date',
      'end_date',
      'body_weight',
      'hours_of_sleep',
      'caffeine_intake',
      'json',
      'session_rpe',
      'notes',
    ];
    const fields = Object.keys(data).some((key) => availableFields.indexOf(key) >= 0);
    if (!fields) throw new Error(`Must include ${availableFields.join(', ')} to update!`);
    return true;
  }),
  body('user_id')
    .trim()
    .notEmpty()
    .withMessage('User id must not be empty!')
    .isInt()
    .withMessage('User id must be an number!')
    .custom(async (user_id) => {
      if (user_id) {
        const user = await UserQueries.findUserById(user_id);
        if (user.length === 0) throw new Error('User does not exist!');
      }
      return true;
    }),
  body('name').optional().trim().notEmpty().withMessage('Session name must not be empty!'),
  body('start_date')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Start date must not be empty!')
    .isISO8601()
    .toDate()
    .withMessage('Start date must be in date format'),
  body('end_date')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('End date must not be empty!')
    .isISO8601()
    .toDate()
    .withMessage('End date must be in date format'),
  body('block_id')
    .optional()
    .trim()
    .isFloat()
    .withMessage('Block ID must be an integer format!')
    .toFloat(),
  body('body_weight')
    .optional()
    .trim()
    .isFloat()
    .withMessage('Body weight must be an integer format!')
    .toFloat(),
  body('hours_of_sleep')
    .optional()
    .trim()
    .isFloat()
    .withMessage('Hours of sleep must be an integer format!')
    .toFloat(),
  body('session_rpe')
    .optional()
    .trim()
    .isFloat()
    .withMessage('Session RPE must be an integer format!'),
  body('caffeine_intake')
    .optional()
    .trim()
    .isFloat()
    .withMessage('caffeine_intake must be an integer format!'),
  body('json')
    .optional()
    .trim()
    .custom((json) => {
      try {
        JSON.stringify(json);
        return true;
      } catch (e) {
        throw new Error('json must be json format');
      }
    }),
  body('notes')
    .optional()
    .trim()
    .isLength({ min: 1, max: 250 })
    .withMessage('Notes must be at least 1 character long or less than 250 characters long'),
];

export const getSessionsWithVideos = [
  param('user_id')
    .trim()
    .notEmpty()
    .withMessage('User id must not be empty!')
    .bail()
    .isInt()
    .withMessage('User id must be an number!')
    .bail()
    .custom(async (user_id) => {
      if (user_id) {
        const user = await UserQueries.findUserById(user_id);
        if (user.length === 0) throw new Error('User does not exist!');
      }
      return true;
    })
    .toInt(),
];
