/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // sets
  await knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS sets (
      id                        SERIAL PRIMARY KEY,
      exercise_id               INT REFERENCES exercises on DELETE CASCADE NOT NULL,
      reps                      INT DEFAULT NULL,
      rpe                       INT DEFAULT NULL,
      weight                    INT DEFAULT NULL,
      user_id                   INT REFERENCES users on DELETE CASCADE NOT NULL,
      session_id                INT REFERENCES sessions on DELETE CASCADE NOT NULL,
      notes                     VARCHAR(1000) DEFAULT NULL,
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
  await knex.schema.raw(`DROP TABLE IF EXISTS sets;`);
}
