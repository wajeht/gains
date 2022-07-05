import { body } from 'express-validator';

/* A validation for the contact form. */
export const postContact = [
  body('email')
    .notEmpty()
    .withMessage('The value must not be empty!')
    .trim()
    .isEmail()
    .withMessage('The value must be an email!'),
  body('subject')
    .notEmpty()
    .withMessage('The value must not be empty!')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('The value must be at least 1 character long or less than 200 character long'),
  body('message')
    .notEmpty()
    .withMessage('The value must not be empty!')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('The value must be at least 1 character long or less than 500 character long'),
];
