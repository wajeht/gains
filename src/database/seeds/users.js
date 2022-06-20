/**
 * It deletes all the users in the database, then inserts three new users
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      id: 1,
      username: "yanlon",
      email: "yanlon@dog.com",
      password: "$2a$14$wN0neQToMrorwU7lylerJeVmFHvXZB.ZzyEj/ZbjDOk4TIBXcaEfq",
    },
    {
      id: 2,
      username: "soapwa",
      email: "soapwa@dog.com",
      password: "$2a$14$wN0neQToMrorwU7lylerJeVmFHvXZB.ZzyEj/ZbjDOk4TIBXcaEfq",
    },
    {
      id: 3,
      username: "apollo",
      email: "apollo@dog.com",
      password: "$2a$14$wN0neQToMrorwU7lylerJeVmFHvXZB.ZzyEj/ZbjDOk4TIBXcaEfq",
    },
  ]);
}
