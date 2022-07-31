/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // user details
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS user_details (
      id                                SERIAL PRIMARY KEY,
      first_name                        VARCHAR(250),
      last_name                         VARCHAR(250),
      role                              VARCHAR(250) NOT NULL DEFAULT 'user',
      birth_date                        DATE,
      weight                            INT,
      profile_picture_url               VARCHAR(1000),
      profile_picture_path              VARCHAR(1000),
      verified                          BOOLEAN DEFAULT FALSE,
      verification_token                VARCHAR(500) NOT NULL,
      verified_at                       TIMESTAMP DEFAULT NULL,
      password_reset_token              VARCHAR(500) DEFAULT NULL,
      password_reset_token_expiration   TIMESTAMP DEFAULT NULL,
      user_id                           INT REFERENCES users on DELETE CASCADE NOT NULL,
      deleted                           BOOLEAN DEFAULT FALSE,
      created_at                        TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at                        TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.raw(`DROP TABLE IF EXISTS user_details;`);
}
