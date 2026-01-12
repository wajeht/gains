import { query } from 'express-validator';

export const getViewLogs = [
  query('download')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('download must not be empty!')
    .bail()
    .isBoolean()
    .withMessage('The download must be an boolean!')
    .bail()
    .toBoolean(),
  query('latest')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('latest must not be empty!')
    .bail()
    .isInt()
    .withMessage('latest must be a number!')
    .bail()
    .isInt(),
];
