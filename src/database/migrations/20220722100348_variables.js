/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('variables', (table) => {
    table.increments('id').primary();
    table.integer('body_weight').defaultTo(null);
    table.integer('caffeine_intake').defaultTo(null);
    table.integer('calories_prior_session').defaultTo(null);
    table.integer('total_calories').defaultTo(null);
    table.integer('water_prior_session').defaultTo(null);
    table.integer('total_water').defaultTo(null);
    table.integer('hours_of_sleep').defaultTo(null);
    table.integer('stress_level').defaultTo(null);
    table.jsonb('json').defaultTo(null);
    table.integer('session_id').references('id').inTable('sessions').onDelete('CASCADE');
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
  await knex.schema.dropTableIfExists('variables');
}
