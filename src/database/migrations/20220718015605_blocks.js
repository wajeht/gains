/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // blocks
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS blocks (
      id                    SERIAL PRIMARY KEY,
      name                  VARCHAR(250) NOT NULL,
      description           VARCHAR(1000) DEFAULT NULL,
      start_date            TIMESTAMP NOT NULL DEFAULT NOW(),
      end_date              TIMESTAMP NOT NULL DEFAULT NULL,
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
  await knex.schema.raw(`DROP TABLE IF EXISTS blocks;`);
}
