
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('task_status').del()
    .then(() => {
      // Inserts seed entries
      return knex('task_status').insert([
        {id: 1, name: 'новый'},
        {id: 2, name: 'в работе'},
        {id: 3, name: 'на тестировании'},
        {id: 4, name: 'завершен'},
      ]);
    });
};
