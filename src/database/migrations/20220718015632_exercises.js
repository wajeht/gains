/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // exercise
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS exercises (
      id                        SERIAL PRIMARY KEY,
      name                      VARCHAR(250) NOT NULL,
      deleted                   BOOLEAN DEFAULT FALSE,
      exercise_category_id      INT REFERENCES exercise_categories on DELETE CASCADE NOT NULL,
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
  await knex.schema.raw(`DROP TABLE IF EXISTS exercises;`);
}
