
exports.up = (knex) => (
    knex.schema.createTable('task_status', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  );

exports.down = (knex) => knex.schema.dropTable('task_status');
