/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('user_details', (table) => {
    table.increments('id').primary();
    table.string('first_name', 250);
    table.string('bio', 128);
    table.string('last_name', 250);
    table.string('role', 250).notNullable().defaultTo('user');
    table.date('birth_date');
    table.integer('weight');
    table.string('profile_picture_url', 1000);
    table.string('profile_picture_path', 1000);
    table.boolean('verified').defaultTo(false);
    table.string('verification_token', 500).notNullable();
    table.timestamp('verified_at').defaultTo(null);
    table.string('password_reset_token', 500).defaultTo(null);
    table.timestamp('password_reset_token_expiration').defaultTo(null);
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table.boolean('deleted').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('user_details');
}
