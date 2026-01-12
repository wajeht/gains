/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Make password nullable for Google OAuth users
  await knex.schema.alterTable('users', (table) => {
    table.string('password', 500).nullable().alter();
  });

  // Make verification_token nullable since Google OAuth users don't need email verification
  await knex.schema.alterTable('user_details', (table) => {
    table.string('verification_token', 500).nullable().alter();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.string('password', 500).notNullable().alter();
  });

  await knex.schema.alterTable('user_details', (table) => {
    table.string('verification_token', 500).notNullable().alter();
  });
}
