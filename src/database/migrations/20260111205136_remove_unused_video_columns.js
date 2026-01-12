export function up(knex) {
  return knex.schema.alterTable('videos', (table) => {
    table.dropColumn('video_url');
    table.dropColumn('video_path');
    table.dropColumn('screenshot_url');
    table.dropColumn('screenshot_path');
    table.dropColumn('json');
  });
}

export function down(knex) {
  return knex.schema.alterTable('videos', (table) => {
    table.string('video_url', 1000).defaultTo(null);
    table.string('video_path', 1000).defaultTo(null);
    table.string('screenshot_url', 1000).defaultTo(null);
    table.string('screenshot_path', 1000).defaultTo(null);
    table.json('json').defaultTo(null);
  });
}
