/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // logs
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS logs (
      id                    SERIAL PRIMARY KEY,
      type                  VARCHAR(250) NOT NULL,
      description           VARCHAR(1000) NOT NULL,
      user_id               INT REFERENCES users on DELETE CASCADE NOT NULL,
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
