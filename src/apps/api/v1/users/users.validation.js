import { check, param, body } from 'express-validator';

/* A validation for the user input. */
export const postUser = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('The value must not be empty!')
    .isEmail()
    .withMessage('The value must be an email!'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('The value must not be empty!')
    .isLength({ min: 6, max: 20 })
    .withMessage('The value must be at least 8 character long or less than 20 character long'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('The value must not be empty!')
    .isLength({ min: 10, max: 100 })
    .withMessage('The value must be at least 8 character long or less than 100 character long')
    .custom((value) => {
      if (value.split('').some((i) => i == i.toUpperCase())) return true;
    })
    .withMessage('The value must include an uppercase character!')
    .custom((value) => {
      if (value.split('').some((i) => i == i.toLocaleLowerCase())) return true;
    })
    .withMessage('The value must include a lowercase character!')
    .custom((value) => {
      if (/\d/.test(value)) return true;
    })
    .withMessage('The value must include a number character!'),
];
