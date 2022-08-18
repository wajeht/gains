/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // comments
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS comments (
      id                    SERIAL PRIMARY KEY,
      comment               VARCHAR(1000) NOT NULL,
      user_id               INT REFERENCES users on DELETE CASCADE NOT NULL,
      session_id            INT REFERENCES sessions on DELETE CASCADE NOT NULL,
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
  await knex.schema.raw(`DROP TABLE IF EXISTS comments;`);
}
