/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // utils
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS utils (
      id                    SERIAL PRIMARY KEY,
      object                VARCHAR(250),
      description           VARCHAR(1000),
      json                  jsonb,
      user_id               INT REFERENCES users on DELETE CASCADE,
      deleted               BOOLEAN DEFAULT FALSE,
      created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.raw(`DROP TABLE IF EXISTS utils;`);
}
