import crypto from 'crypto';

import EmailService from '../../services/email.service.js';
import RandomPasswordGenerator from '../../libs/random-password-generator.js';
import Password from '../../libs/password.js';
import logger from '../../libs/logger.js';
import { admin, env } from '../../config/env.js';
import { red } from '../../utils/rainbow-log.js';

import * as UsersQueries from '../../apps/api/v1/users/users.queries.js';
import * as AuthQueries from '../../apps/api/auth/auth.queries.js';

if (env === 'production') {
  logger.warn('Skipping local admin account creation for production!');
  process.exit(1);
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
    const verified = await AuthQueries.verifyUser(user.id, date);

    await knex('user_details').update({ role: 'admin' });

    // TODO!: this emailing code below does not work currently
    // TODO!: knex changes path so, path of template keep changing
    // send verification email
    // await EmailService.send({
    //   to: newUser.email,
    //   subject: 'Admin account',
    //   template: 'admin-account',
    //   data: {
    //     username: newUser.username,
    //     email: newUser.email,
    //     password: newUser.password,
    //   },
    // });

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
