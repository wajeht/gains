/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('activities', (table) => {
    table.increments('id').primary();
    table.string('object', 250).notNullable();
    table.integer('object_id').notNullable();
    table.string('description', 1000).notNullable();
    table.jsonb('json').defaultTo(null);
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
  await knex.schema.dropTableIfExists('activities');
}
