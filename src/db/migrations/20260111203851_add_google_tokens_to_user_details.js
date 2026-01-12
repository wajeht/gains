export function up(knex) {
  return knex.schema.alterTable('user_details', (table) => {
    table.text('google_access_token').nullable();
    table.text('google_refresh_token').nullable();
    table.timestamp('google_token_expires_at').nullable();
  });
}

export function down(knex) {
  return knex.schema.alterTable('user_details', (table) => {
    table.dropColumn('google_access_token');
    table.dropColumn('google_refresh_token');
    table.dropColumn('google_token_expires_at');
  });
}
