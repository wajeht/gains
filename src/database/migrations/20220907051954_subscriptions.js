/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // subscriptions
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id                    SERIAL PRIMARY KEY,
      email                 VARCHAR(250) NOT NULL,
      object                VARCHAR(250) DEFAULT NULL,
      object_id             VARCHAR(250) DEFAULT NULL,
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
  await knex.schema.raw(`DROP TABLE IF EXISTS subscriptions;`);
}
