import { check, param, body, query } from 'express-validator';
import * as UsersQueries from '../users/users.queries.js';
import * as VariablesQueries from './variables.queries.js';

export const deleteAVariable = [
  param('variable_id')
    .trim()
    .notEmpty()
    .withMessage('variable_id id must not be empty!')
    .bail()
    .isInt()
    .withMessage('variable_id id must be an number!')
    .bail()
    .custom(async (variable_id) => {
      if (variable_id) {
        const variable = await VariablesQueries.getAVariable(variable_id);
        if (variable.length === 0) throw new Error('variable does not exist!');
      }
      return true;
    })
    .toInt(),
  query('user_id')
    .trim()
    .notEmpty()
    .withMessage('User id must not be empty!')
    .bail()
    .isInt()
    .withMessage('User id must be an number!')
    .bail()
    .custom(async (user_id) => {
      if (user_id) {
        const user = await UsersQueries.findUserById(user_id);
        if (user.length === 0) throw new Error('User does not exist!');
      }
      return true;
    })
    .toInt(),
];

export const postAVariable = [
  body().custom((body) => {
    const requiredFields = [
      'user_id',
      'body_weight',
      'caffeine_intake',
      'calories_prior_session',
      'total_calories',
      'water_prior_session',
      'total_water',
      'hours_of_sleep',
      'stress_level',
    ];
    const equal = Object.keys(body).some((key) => requiredFields.indexOf(key) >= 0);
    if (!equal) throw new Error(`Must include ${requiredFields.join(', ')} to request!`);
    return true;
  }),
  body('user_id')
    .trim()
    .notEmpty()
    .withMessage('user_id must not be empty!')
    .bail()
    .isInt()
    .withMessage('user_id must be an ID!')
    .bail()
    .toInt(),

  body('body_weight')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('body_weight must not be empty!')
    .bail()
    .isInt()
    .withMessage('body_weight must be an ID!')
    .bail()
    .toInt(),

  body('caffeine_intake')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('caffeine_intake must not be empty!')
    .bail()
    .isInt()
    .withMessage('caffeine_intake must be an ID!')
    .bail()
    .toInt(),

  body('calories_prior_session')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('calories_prior_session must not be empty!')
    .bail()
    .isInt()
    .withMessage('calories_prior_session must be an ID!')
    .bail()
    .toInt(),

  body('total_calories')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('total_calories must not be empty!')
    .bail()
    .isInt()
    .withMessage('total_calories must be an ID!')
    .bail()
    .toInt(),

  body('water_prior_session')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('water_prior_session must not be empty!')
    .bail()
    .isInt()
    .withMessage('water_prior_session must be an ID!')
    .bail()
    .toInt(),

  body('total_water')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('total_water must not be empty!')
    .bail()
    .isInt()
    .withMessage('total_water must be an ID!')
    .bail()
    .toInt(),

  body('hours_of_sleep')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('hours_of_sleep must not be empty!')
    .bail()
    .isInt()
    .withMessage('hours_of_sleep must be an ID!')
    .bail()
    .toInt(),

  body('stress_level')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('stress_level must not be empty!')
    .bail()
    .isInt()
    .withMessage('stress_level must be an ID!')
    .bail()
    .toInt(),
];

/* Validating the user_id. */
export const getOpenPowerliftingResult = [
  query('q')
    .trim()
    .notEmpty()
    .withMessage('search text must not be empty!')
    .bail()
    .isLength({ min: 1, max: 30 })
    .withMessage('search text must be at least 1 character long or less than 30 character long')
    .bail(),
];

/* Validating the user_id. */
export const getBodyweight = [
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
        const user = await UsersQueries.findUserById(user_id);
        if (user.length === 0) throw new Error('User does not exist!');
      }
      return true;
    })
    .toInt(),
];

/* Validating the user_id. */
export const getWeeklyWeightIn = [
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
        const user = await UsersQueries.findUserById(user_id);
        if (user.length === 0) throw new Error('User does not exist!');
      }
      return true;
    })
    .toInt(),
];

/* Validating the user_id. */
export const getRecentPrs = [
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
        const user = await UsersQueries.findUserById(user_id);
        if (user.length === 0) throw new Error('User does not exist!');
      }
      return true;
    })
    .toInt(),
];

export const getRecovery = [
  query('cache')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('cache must not be empty!')
    .bail()
    .isBoolean()
    .withMessage('cache must be a boolean format')
    .bail()
    .toBoolean(),
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
        const user = await UsersQueries.findUserById(user_id);
        if (user.length === 0) throw new Error('User does not exist!');
      }
      return true;
    })
    .toInt(),
];

/* Validating the user_id. */
export const getCalories = [
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
        const user = await UsersQueries.findUserById(user_id);
        if (user.length === 0) throw new Error('User does not exist!');
      }
      return true;
    })
    .toInt(),
];
