/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable('videos', (table) => {
    table.string('youtube_video_id', 255).defaultTo(null);
    table.string('youtube_url', 500).defaultTo(null);
    table.string('youtube_embed_url', 500).defaultTo(null);
    table.string('youtube_thumbnail', 500).defaultTo(null);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable('videos', (table) => {
    table.dropColumn('youtube_video_id');
    table.dropColumn('youtube_url');
    table.dropColumn('youtube_embed_url');
    table.dropColumn('youtube_thumbnail');
  });
}
