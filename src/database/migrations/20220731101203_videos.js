/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('videos', (table) => {
    table.increments('id').primary();
    table.string('video_url', 1000).defaultTo(null);
    table.string('video_path', 1000).defaultTo(null);
    table.string('screenshot_url', 1000).defaultTo(null);
    table.string('screenshot_path', 1000).defaultTo(null);
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table.integer('log_id').references('id').inTable('logs').onDelete('CASCADE').notNullable();
    table.integer('session_id').references('id').inTable('sessions').onDelete('CASCADE');
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
  await knex.schema.dropTableIfExists('videos');
}
