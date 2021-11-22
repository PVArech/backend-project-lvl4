const users = [
          {
            id: 1,
            first_name: 'Вячеслав',
            last_name: 'Павлов',
            email: 'pavlov_box@tut.by',
            password_digest: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
          },
          {
            id: 2,
            first_name: 'Test',
            last_name: 'Тестовый',
            email: '11@11.by',
            password_digest: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
          }
        ];

const statuses = [
          {id: 1, name: 'новый'},
          {id: 2, name: 'в работе'},
          {id: 3, name: 'на тестировании'},
          {id: 4, name: 'завершен'},
        ];

const tasks = [
          {
            id: 1, 
            name: 'Task 1',
            description: 'about task',
            status_id: 1,
            creator_id: 1,
            executor_id: 1,
          },
          {
            id: 2, 
            name: 'Task 2',
            description: 'about task',
            status_id: 2,
            creator_id: 2,
            executor_id: null,
          },
        ];

exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('tasks').del()
      .then(() => {
        return knex('statuses').del();  
      })
      .then(() => {
        return knex('users').del();  
      })
      .then(() => {
        return knex('statuses').insert(statuses);
      })
      .then(() => {
        return knex('users').insert(users);
      })
      .then(() => {
        return knex('tasks').insert(tasks);
      });
  };
