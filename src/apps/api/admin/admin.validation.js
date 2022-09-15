import { body } from 'express-validator';
import * as UserQueries from '../v1/users/users.queries.js';

export const postSeedMockTrainingDataUser = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('The email must not be empty!')
    .bail()
    .isEmail()
    .withMessage('The email must be an email!')
    .bail()
    .custom(async (email) => {
      const exist = await UserQueries.findUserByParam({ email });
      if (exist.length === 0) throw new Error('Username or Email does not exist!');
    }),
];
