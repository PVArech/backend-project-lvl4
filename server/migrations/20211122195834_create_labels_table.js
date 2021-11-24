// @ts-check

exports.up = (knex) => (
  knex.schema.createTable('labels', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
    .createTable('tasks_labels', (table) => {
      table.increments('id').primary();
      table
        .integer('task_id')
        .unsigned()
        .references('id')
        .inTable('tasks')
        .onDelete('CASCADE')
        .index();
      table
        .integer('label_id')
        .unsigned()
        .references('id')
        .inTable('labels')
        .onDelete('RESTRICT')
        .index();
    })
);

exports.down = (knex) => knex.schema
  .dropTableIfExists('tasks_labels')
  .dropTableIfExists('labels');
