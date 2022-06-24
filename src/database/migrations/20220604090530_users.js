/**
 * It creates a table called users with an id, username, email, password, and timestamps
 * @param { import("knex").Knex } knex  - The knex instance that was created in the db.js file.
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary().notNullable();
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

/**
 * This function drops the user table from the database.
 * @param { import("knex").Knex } knex - The knex instance that was created in the migration file.
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('users');
}
