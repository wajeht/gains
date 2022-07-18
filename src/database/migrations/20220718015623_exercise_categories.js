/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // exercise_categories
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS exercise_categories (
      id                        SERIAL PRIMARY KEY,
      name                      VARCHAR(250) NOT NULL,
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
  await knex.schema.raw(`DROP TABLE IF EXISTS exercise_categories;`);
}
