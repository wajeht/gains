/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // api_keys
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id                    SERIAL PRIMARY KEY,
      key                   VARCHAR(500) NOT NULL UNIQUE,
      deleted               BOOLEAN DEFAULT FALSE,
      user_id               INT REFERENCES users on DELETE CASCADE NOT NULL,
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
  await knex.schema.raw(`DROP TABLE IF EXISTS api_keys;`);
}
