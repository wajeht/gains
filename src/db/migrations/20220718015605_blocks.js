/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('blocks', (table) => {
    table.increments('id').primary();
    table.string('name', 250).notNullable();
    table.string('description', 1000).defaultTo(null);
    table.timestamp('start_date').defaultTo(knex.fn.now());
    table.timestamp('end_date').defaultTo(null);
    table.boolean('deleted').defaultTo(false);
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
  await knex.schema.dropTableIfExists('blocks');
}
