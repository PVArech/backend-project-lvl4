import _ from 'lodash';
import getApp from '../server/index.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test CRUD tasks', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();
  let cookie;

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    await knex.migrate.latest();
    await prepareData(app);
    models = app.objection.models;
  });

  it('test read tasks error', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
    });
    expect(response.statusCode).toBe(302);
  });

  it('test create new task error', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
    });
    expect(response.statusCode).toBe(302);
  });

  it('test sign in', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newSession'),
    });
    expect(response.statusCode).toBe(200);

    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: testData.users.existing,
      },
    });
    expect(responseSignIn.statusCode).toBe(302);

    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    cookie = { [name]: value };
  });

  it('test read tasks', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
    const bases = await models.task.query();
    expect(bases).toHaveLength(3);
  });

  it('test create new task', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);

    const responseNew = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies: cookie,
    });
    expect(responseNew.statusCode).toBe(200);

    const responseError = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: _.omit(testData.tasks.new, 'statusId'),
      },
      cookies: cookie,
    });
    expect(responseError.statusCode).toBe(200);
    let bases = await models.task.query();
    expect(bases).toHaveLength(3);

    const taskNew = testData.tasks.new;
    const responsePost = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: taskNew,
      },
      cookies: cookie,
    });
    expect(responsePost.statusCode).toBe(302);

    const status = await models.task.query().findOne({ name: taskNew.name });
    expect(status).toMatchObject(taskNew);

    bases = await models.task.query();
    expect(bases).toHaveLength(4);
  });

  it('test edit task', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `${app.reverse('editTask', { id: 3 })}`,
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);

    const responseEditError = await app.inject({
      method: 'PATCH',
      url: `${app.reverse('task', { id: 3 })}`,
      payload: {
        data: _.omit(testData.tasks.existing, 'statusId'),
      },
      cookies: cookie,
    });
    expect(responseEditError.statusCode).toBe(200);

    const responseEdit = await app.inject({
      method: 'PATCH',
      url: `${app.reverse('task', { id: 3 })}`,
      payload: {
        data: testData.tasks.edited,
      },
      cookies: cookie,
    });
    expect(responseEdit.statusCode).toBe(302);
    const [status] = await models.task.query().findByIds(3);
    expect(status).toHaveProperty('name', 'Task 23');
  });

  it('test view task', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `${app.reverse('task', { id: 3 })}`,
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
  });

  it('test !delete task other user', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `${app.reverse('task', { id: 1 })}`,
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);
    const bases = await models.task.query();
    expect(bases).toHaveLength(4);
  });

  it('test delete task', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `${app.reverse('task', { id: 4 })}`,
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);
    const bases = await models.task.query();
    expect(bases).toHaveLength(3);
  });

  it('test sign out', async () => {
    const responseSignOut = await app.inject({
      method: 'DELETE',
      url: app.reverse('session'),
      cookies: cookie,
    });
    expect(responseSignOut.statusCode).toBe(302);
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    app.close();
  });
});
