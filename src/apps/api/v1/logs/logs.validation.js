import { check, param, body } from 'express-validator';
import * as UserQueries from '../users/users.queries.js';
import * as SessionsQueries from '../sessions/sessions.queries.js';
import * as ExercisesQueries from '../exercises/exercises.queries.js';

export const createLogs = [
  body().custom((data) => {
    const availableFields = [
      'name',
      'notes',
      'user_id',
      'session_id',
      'json',
      'exercise_id',
      'collapsed',
      'sets_notes_visibility',
    ];
    const fields = Object.keys(data).some((key) => availableFields.indexOf(key) >= 0);
    if (!fields) throw new Error(`Must include ${availableFields.join(', ')} to update!`);
    return true;
  }),
  body('collapsed')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('collapsed must not be empty!')
    .bail()
    .isBoolean()
    .withMessage('collapsed must a boolean format')
    .bail()
    .toBoolean(),
  body('sets_notes_visibility')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('sets_notes_visibility must not be empty!')
    .bail()
    .isBoolean()
    .withMessage('sets_notes_visibility must a boolean format')
    .bail()
    .toBoolean(),
  body('exercise_id')
    .trim()
    .notEmpty()
    .withMessage('exercise_id must not be empty!')
    .isInt()
    .withMessage('exercise_id must be an ID!')
    .custom(async (exercise_id) => {
      const exercise = await ExercisesQueries.getExerciseById(exercise_id);
      if (exercise.length === 0) throw new Error('exercise_id does not exist!');
      return true;
    })
    .toInt(),
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
  body('session_id')
    .trim()
    .notEmpty()
    .withMessage('Session id must not be empty!')
    .isInt()
    .withMessage('Session id must be an ID!')
    .custom(async (sid) => {
      const user = await SessionsQueries.getSessionBySessionId(sid);
      if (user.length === 0) throw new Error('Session id does not exist!');
      return true;
    })
    .toInt(),
  body('name').trim().notEmpty().withMessage('log name must not be empty!').bail(),
  body('notes')
    .optional()
    .trim()
    .isLength({ min: 1, max: 250 })
    .withMessage('Notes must be at least 1 character long or less than 250 characters long'),
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
];
