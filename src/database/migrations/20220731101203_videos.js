/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // videos
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS videos (
      id                    SERIAL PRIMARY KEY,
      video_url             VARCHAR(1000) DEFAULT NULL,
      video_path            VARCHAR(1000) DEFAULT NULL,
      screenshot_url        VARCHAR(1000) DEFAULT NULL,
      screenshot_path       VARCHAR(1000) DEFAULT NULL,
      user_id               INT REFERENCES users on DELETE CASCADE NOT NULL,
      log_id                INT REFERENCES logs on DELETE CASCADE NOT NULL,
      session_id            INT REFERENCES sessions on DELETE CASCADE,
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
  await knex.schema.raw(`DROP TABLE IF EXISTS videos;`);
}
