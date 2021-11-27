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
  },
  {
    id: 3,
    first_name: 'Ivan',
    last_name: 'Petrov',
    email: 'petrov@mail.ru',
    password_digest: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
  },
  {
    id: 4,
    first_name: 'Egor',
    last_name: 'Letov',
    email: 'letov@tut.by',
    password_digest: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
  },
];

const statuses = [
  { id: 1, name: 'новый' },
  { id: 2, name: 'в работе' },
  { id: 3, name: 'на тестировании' },
  { id: 4, name: 'завершен' },
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
    description: 'about task 2',
    status_id: 2,
    creator_id: 2,
    executor_id: 3,
  },
  {
    id: 3,
    name: 'Task 3',
    description: 'about task 3',
    status_id: 3,
    creator_id: 3,
    executor_id: null,
  },
  {
    id: 4,
    name: 'Task 4',
    description: 'about task 4',
    status_id: 4,
    creator_id: 4,
    executor_id: 1,
  },
  {
    id: 5,
    name: 'Task 5',
    description: 'about task 5',
    status_id: 2,
    creator_id: 1,
    executor_id: 2,
  },
  {
    id: 6,
    name: 'Task 6',
    description: 'about task 6',
    status_id: 1,
    creator_id: 4,
    executor_id: 4,
  },
];

const labels = [
  { id: 1, name: 'bug' },
  { id: 2, name: 'documentation' },
  { id: 3, name: 'duplicate' },
  { id: 4, name: 'enhancement' },
  { id: 5, name: 'good first issue' },
  { id: 6, name: 'help wanted' },
  { id: 7, name: 'invalid' },
  { id: 8, name: 'question' },
  { id: 9, name: 'wontfix' },
];

const tasksLabels = [
  { id: 1, task_id: 1, label_id: 1 },
  { id: 2, task_id: 1, label_id: 9 },
  { id: 3, task_id: 4, label_id: 2 },
  { id: 4, task_id: 4, label_id: 3 },
  { id: 5, task_id: 3, label_id: 4 },
];

exports.seed = (knex) => knex('tasks').del()
  .then(() => knex('labels').del())
  .then(() => knex('statuses').del())
  .then(() => knex('users').del())
  .then(() => knex('statuses').insert(statuses))
  .then(() => knex('users').insert(users))
  .then(() => knex('tasks').insert(tasks))
  .then(() => knex('labels').insert(labels))
  .then(() => knex('tasks_labels').insert(tasksLabels));
