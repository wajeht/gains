/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('subscriptions', (table) => {
    table.increments('id').primary();
    table.string('email', 250).notNullable();
    table.string('object', 250).defaultTo(null);
    table.string('object_id', 250).defaultTo(null);
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
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
  await knex.schema.dropTableIfExists('subscriptions');
}
