/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // tags
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS tags (
      id                    SERIAL PRIMARY KEY,
      name                  VARCHAR(250) NOT NULL,
      log_id                INT REFERENCES logs on DELETE CASCADE NOT NULL,
      user_id               INT REFERENCES users on DELETE CASCADE NOT NULL,
      json                  jsonb DEFAULT NULL,
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
  await knex.schema.raw(`DROP TABLE IF EXISTS tags;`);
}
