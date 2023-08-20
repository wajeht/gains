/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('sets', (table) => {
    table.increments('id').primary();
    table
      .integer('exercise_id')
      .references('id')
      .inTable('exercises')
      .onDelete('CASCADE')
      .notNullable();
    table.integer('reps').defaultTo(null);
    table.integer('rpe').defaultTo(null);
    table.integer('weight').defaultTo(null);
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table
      .integer('session_id')
      .references('id')
      .inTable('sessions')
      .onDelete('CASCADE')
      .notNullable();
    table.integer('log_id').references('id').inTable('logs').onDelete('CASCADE').notNullable();
    table.string('notes', 1000).defaultTo(null);
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
  await knex.schema.dropTableIfExists('sets');
}
