import crypto from 'crypto';

import RandomPasswordGenerator from '../../utils/random-password-generator.js';
import Password from '../../utils/password.js';
import logger from '../../utils/logger.js';
import { admin, env } from '../../config/env.js';

import * as UsersQueries from '../../app/api/v1/users/users.queries.js';
import * as AuthQueries from '../../app/api/auth/auth.queries.js';

if (env === 'production') {
  logger.warn('Skipping local admin account creation for production environment!');
  process.exit(0);
}

export async function seed(knex) {
  try {
    await knex('users').del();
    await knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE'); // reset sql id auto increment to 1

    const randomPasswordOrPredefinedAdminPassword = admin.password ?? new RandomPasswordGenerator().getPassword(); // prettier-ignore
    const verificationToken = crypto.randomBytes(64).toString('hex');
    const hashedPassword = await Password.hash(randomPasswordOrPredefinedAdminPassword);

    const newUser = {
      email: admin.email,
      username: admin.username,
      password: hashedPassword,
    };

    const [user] = await UsersQueries.createUser(newUser, verificationToken);

    const date = new Date();
    await AuthQueries.verifyUser(user.id, date);

    await knex('user_details').update({ role: 'admin' });

    logger.info(`Admin account was created for user id: ${user.id}`);

    console.log({
      username: newUser.username,
      email: newUser.email,
      password: randomPasswordOrPredefinedAdminPassword,
    });
  } catch (e) {
    logger.error(e);
  }
}
