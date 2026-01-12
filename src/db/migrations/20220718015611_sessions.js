/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('sessions', (table) => {
    table.increments('id').primary();
    table.string('name', 500).notNullable();
    table.integer('block_id').references('id').inTable('blocks').onDelete('CASCADE');
    table.timestamp('start_date').defaultTo(knex.fn.now());
    table.timestamp('end_date').defaultTo(null);
    table.integer('session_rpe').defaultTo(null);
    table.jsonb('json').defaultTo(null);
    table.boolean('deleted').defaultTo(false);
    table.string('notes', 1000).defaultTo(null);
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('sessions');
}
