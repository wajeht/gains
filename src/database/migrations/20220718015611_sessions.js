/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // sessions
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS sessions (
      id                        SERIAL PRIMARY KEY,
      name                      VARCHAR(500) NOT NULL,
      block_id                  INT REFERENCES blocks on DELETE CASCADE,
      start_date                TIMESTAMP NOT NULL DEFAULT NOW(),
      end_date                  TIMESTAMP DEFAULT NULL,
      body_weight               INT DEFAULT NULL,
      hours_of_sleep            INT DEFAULT NULL,
      caffeine_intake           INT DEFAULT NULL,
      calories_prior_session    INT DEFAULT NULL,
      session_rpe               INT DEFAULT NULL,
      json                      jsonb DEFAULT NULL,
      deleted                   BOOLEAN DEFAULT FALSE,
      notes                     VARCHAR(1000) DEFAULT NULL,
      user_id                   INT REFERENCES users on DELETE CASCADE NOT NULL,
      created_at                TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at                TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.raw(`DROP TABLE IF EXISTS sessions;`);
}
