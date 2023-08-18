/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('exercises', (table) => {
    table.increments('id').primary();
    table.string('name', 250).notNullable();
    table.boolean('deleted').defaultTo(false);
    table
      .integer('exercise_category_id')
      .references('id')
      .inTable('exercise_categories')
      .onDelete('CASCADE')
      .notNullable();
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
  await knex.schema.dropTableIfExists('exercises');
}
