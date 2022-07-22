/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // variables
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS variables (
      id                        SERIAL PRIMARY KEY,
      body_weight               INT DEFAULT NULL,
      caffeine_intake           INT DEFAULT NULL,
      calories_prior_session    INT DEFAULT NULL,
      total_calories            INT DEFAULT NULL,
      water_prior_session       INT DEFAULT NULL,
      total_water               INT DEFAULT NULL,
      hours_of_sleep            INT DEFAULT NULL,
      stress_level              INT DEFAULT NULL,
      json                      JSONB DEFAULT NULL,
      user_id                   INT REFERENCES users on DELETE CASCADE NOT NULL,
      deleted                   BOOLEAN DEFAULT FALSE,
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
  await knex.schema.raw(`DROP TABLE IF EXISTS variables;`);
}
