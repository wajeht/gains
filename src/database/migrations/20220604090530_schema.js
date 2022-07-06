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
      id                    SERIAL PRIMARY KEY,
      first_name            VARCHAR(250),
      last_name             VARCHAR(250),
      role                  VARCHAR(250),
      birth_date            DATE,
      weight                INT,
      profile_picture_url   VARCHAR(500),
      is_verified           BOOLEAN DEFAULT FALSE,
      verification_token    VARCHAR(500) NOT NULL,
      verified_at           TIMESTAMP,
      user_id               INT REFERENCES users on DELETE CASCADE NOT NULL,
      created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
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
      user_id               INT REFERENCES users on DELETE CASCADE NOT NULL,
      created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

/**
 * @param { import("knex").Knex } knex - The knex instance that was created in the migration file.
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.raw(`DROP TABLE IF EXISTS user_details;`);
  await knex.schema.raw(`DROP TABLE IF EXISTS users;`);
}
