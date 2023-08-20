/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('logs', (table) => {
    table.increments('id').primary();
    table.string('name', 500).notNullable();
    table.string('notes', 1000);
    table.boolean('collapsed').defaultTo(false);
    table.boolean('private').defaultTo(true);
    table.boolean('sets_notes_visibility').defaultTo(false);
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table
      .integer('session_id')
      .references('id')
      .inTable('sessions')
      .onDelete('CASCADE')
      .notNullable();
    table
      .integer('exercise_id')
      .references('id')
      .inTable('exercises')
      .onDelete('CASCADE')
      .notNullable();
    table.jsonb('json').defaultTo(null);
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
  await knex.schema.dropTableIfExists('logs');
}
