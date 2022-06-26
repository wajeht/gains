/**
 * It deletes all the users in the database, then inserts three new users
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  const u = await knex('users')
    .insert([
      {
        id: 1,
        username: 'yanlon',
        email: 'yanlon@dog.com',
        password: '$2a$14$wN0neQToMrorwU7lylerJeVmFHvXZB.ZzyEj/ZbjDOk4TIBXcaEfq',
      },
      {
        id: 2,
        username: 'soapwa',
        email: 'soapwa@dog.com',
        password: '$2a$14$wN0neQToMrorwU7lylerJeVmFHvXZB.ZzyEj/ZbjDOk4TIBXcaEfq',
      },
      {
        id: 3,
        username: 'apollo',
        email: 'apollo@dog.com',
        password: '$2a$14$wN0neQToMrorwU7lylerJeVmFHvXZB.ZzyEj/ZbjDOk4TIBXcaEfq',
      },
    ])
    .returning('*')
    .then((rows) => {
      return rows.map((r) => {
        const d = {
          user_id: r.id,
        };
        return d;
      });
    })
    .then((data) => {
      return knex('user_details').insert(data);
    });
}
