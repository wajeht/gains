import logger from '../../utils/logger.js';
import { admin, env } from '../../config/env.js';

if (env === 'production') {
  logger.warn('Skipping local admin account creation for production environment!');
  process.exit(0);
}

export async function seed(knex) {
  try {
    await knex('users').del();
    await knex('user_details').del();

    // Create admin user
    const [user] = await knex('users')
      .insert({
        email: admin.email,
        username: admin.username,
      })
      .returning('*');

    // Create user details with admin role
    await knex('user_details').insert({
      user_id: user.id,
      role: 'admin',
      verified: true,
      verified_at: new Date(),
    });

    logger.info(`Admin account was created for user id: ${user.id}`);

    console.log({
      username: admin.username,
      email: admin.email,
      note: 'Login with Google using this email',
    });
  } catch (e) {
    logger.error(e);
  }
}
