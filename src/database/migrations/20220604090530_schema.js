/**
 * @param { import("knex").Knex } knex  - The knex instance that was created in the db.js file.
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // users
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS users (
      id                    SERIAL PRIMARY KEY,
      email                 VARCHAR(250) NOT NULL UNIQUE,
      username              VARCHAR(250) NOT NULL UNIQUE,
      password              VARCHAR(500) NOT NULL,
      created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // user details
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS user_details (
      id                                SERIAL PRIMARY KEY,
      first_name                        VARCHAR(250),
      last_name                         VARCHAR(250),
      role                              VARCHAR(250) NOT NULL DEFAULT 'user',
      birth_date                        DATE,
      weight                            INT,
      profile_picture_url               VARCHAR(500),
      is_verified                       BOOLEAN DEFAULT FALSE,
      verification_token                VARCHAR(500) NOT NULL,
      verified_at                       TIMESTAMP DEFAULT NULL,
      password_reset_token              VARCHAR(500) DEFAULT NULL,
      password_reset_token_expiration   TIMESTAMP DEFAULT NULL,
      user_id                           INT REFERENCES users on DELETE CASCADE NOT NULL,
      created_at                        TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at                        TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // api_keys
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id                    SERIAL PRIMARY KEY,
      key                   VARCHAR(500) NOT NULL UNIQUE,
      hashed_key            VARCHAR(500) NOT NULL UNIQUE,
      user_id               INT REFERENCES users on DELETE CASCADE NOT NULL,
      created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // logs
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS logs (
      id                    SERIAL PRIMARY KEY,
      type                  VARCHAR(250) NOT NULL,
      description           VARCHAR(1000) NOT NULL,
      user_id               INT REFERENCES users on DELETE CASCADE NOT NULL,
      created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // blocks
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS blocks (
      id                    SERIAL PRIMARY KEY,
      name                  VARCHAR(250) NOT NULL,
      description           VARCHAR(1000) DEFAULT NULL,
      start_date            TIMESTAMP NOT NULL DEFAULT NOW(),
      end_date              TIMESTAMP NOT NULL DEFAULT NULL,
      user_id               INT REFERENCES users on DELETE CASCADE NOT NULL,
      created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // sessions
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS sessions (
      id                        SERIAL PRIMARY KEY,
      session_name              VARCHAR(500) NOT NULL,
      block_id                  INT REFERENCES blocks on DELETE CASCADE,
      start_date                TIMESTAMP NOT NULL DEFAULT NOW(),
      end_date                  TIMESTAMP DEFAULT NULL,
      body_weight               INT DEFAULT NULL,
      hours_of_sleep            INT DEFAULT NULL,
      session_rpe               INT DEFAULT NULL,
      notes                     VARCHAR(1000) DEFAULT NULL,
      user_id                   INT REFERENCES users on DELETE CASCADE NOT NULL,
      created_at                TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at                TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // exercise_categories
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS exercise_categories (
      id                        SERIAL PRIMARY KEY,
      name                      VARCHAR(250) NOT NULL UNIQUE,
      is_deleted                BOOLEAN DEFAULT FALSE,
      created_at                TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at                TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // exercise
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS exercise (
      id                        SERIAL PRIMARY KEY,
      name                      VARCHAR(250) NOT NULL UNIQUE,
      is_deleted                BOOLEAN DEFAULT FALSE,
      exercise_category_id      INT REFERENCES exercise_categories on DELETE CASCADE NOT NULL,
      user_id                   INT REFERENCES users on DELETE CASCADE,
      created_at                TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at                TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

/**
 * @param { import("knex").Knex } knex - The knex instance that was created in the migration file.
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.raw(`DROP TABLE IF EXISTS sessions;`);
  await knex.schema.raw(`DROP TABLE IF EXISTS blocks;`);
  await knex.schema.raw(`DROP TABLE IF EXISTS logs;`);
  await knex.schema.raw(`DROP TABLE IF EXISTS api_keys;`);
  await knex.schema.raw(`DROP TABLE IF EXISTS user_details;`);
  await knex.schema.raw(`DROP TABLE IF EXISTS users;`);
}
