/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // logs
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS logs (
      id                    SERIAL PRIMARY KEY,
      name                  VARCHAR(500) NOT NULL,
      notes                 VARCHAR(1000),
      collapsed             BOOLEAN DEFAULT FALSE,
      private               BOOLEAN DEFAULT TRUE,
      sets_notes_visibility BOOLEAN DEFAULT FALSE,
      user_id               INT REFERENCES users on DELETE CASCADE NOT NULL,
      session_id            INT REFERENCES sessions on DELETE CASCADE NOT NULL,
      exercise_id           INT REFERENCES exercises on DELETE CASCADE NOT NULL,
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
  await knex.schema.raw(`DROP TABLE IF EXISTS logs;`);
}
