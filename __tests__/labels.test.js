// @ts-check

import _ from 'lodash';
import getApp from '../server/index.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test CRUD labels', () => {
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

  it('test read labels error', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('labels'),
    });
    expect(response.statusCode).toBe(302);
  });

  it('test create new labels error', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
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

  it('test read labels', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('labels'),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
    const bases = await models.label.query();
    expect(bases).toHaveLength(9);
  });

  it('test create new label', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('labels'),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);

    const responseNew = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
      cookies: cookie,
    });
    expect(responseNew.statusCode).toBe(200);

    const responseError = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: {
        data: _.omit(testData.labels.existing, 'name'),
      },
      cookies: cookie,
    });
    expect(responseError.statusCode).toBe(200);

    const labelNew = testData.labels.new;
    const responsePost = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: {
        data: labelNew,
      },
      cookies: cookie,
    });
    expect(responsePost.statusCode).toBe(302);

    const status = await models.label.query().findOne({ name: labelNew.name });
    expect(status).toMatchObject(labelNew);

    const bases = await models.label.query();
    expect(bases).toHaveLength(10);
  });

  it('test edit label', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `${app.reverse('editLabel', { id: 1 })}`,
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);

    const responseEditError = await app.inject({
      method: 'PATCH',
      url: `${app.reverse('label', { id: 1 })}`,
      payload: {
        data: _.omit(testData.labels.existing, 'name'),
      },
      cookies: cookie,
    });
    expect(responseEditError.statusCode).toBe(200);

    const responseEdit = await app.inject({
      method: 'PATCH',
      url: `${app.reverse('label', { id: 8 })}`,
      payload: {
        data: testData.labels.edited,
      },
      cookies: cookie,
    });
    expect(responseEdit.statusCode).toBe(302);
    const [label] = await models.label.query().findByIds(8);
    expect(label).toHaveProperty('name', 'Edited labels');
  });

  it('test delete label', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `${app.reverse('label', { id: 5 })}`,
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);
    const bases = await models.label.query();
    expect(bases).toHaveLength(9);
  });

  it('test !delete label existing in task', async () => {
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
    let bases = await models.task.query();
    expect(bases).toHaveLength(4);

    const response = await app.inject({
      method: 'DELETE',
      url: `${app.reverse('label', { id: 1 })}`,
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
    bases = await models.label.query();
    expect(bases).toHaveLength(9);
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
