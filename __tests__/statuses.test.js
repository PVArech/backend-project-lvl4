// @ts-check

import getApp from '../server/index.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test CRUD', () => {
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

  it('test read statuses error', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
    });
    expect(response.statusCode).toBe(302);
  });

  it('test create new status error', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
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

  it('test read statuses', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
    const bases = await models.status.query();
    expect(bases).toHaveLength(4);
  });

  it('test create new status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);

    const responseNew = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies: cookie,
    });
    expect(responseNew.statusCode).toBe(200);

    const responseError = await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: testData.statuses.existing,
      },
      cookies: cookie,
    });
    expect(responseError.statusCode).toBe(200);

    const statusNew = testData.statuses.new;
    const responsePost = await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: statusNew,
      },
      cookies: cookie,
    });
    expect(responsePost.statusCode).toBe(302);

    const status = await models.status.query().findOne({ name: statusNew.name });
    expect(status).toMatchObject(statusNew);

    const bases = await models.status.query();
    expect(bases).toHaveLength(5);
  });

  it('test edit status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `${app.reverse('statuses')}/${1}/edit`,
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);

    const responseEditError = await app.inject({
      method: 'patch',
      url: `${app.reverse('statuses')}/${1}`,
      payload: {
        data: testData.statuses.existing,
      },
      cookies: cookie,
    });
    expect(responseEditError.statusCode).toBe(200);

    const responseEdit = await app.inject({
      method: 'patch',
      url: `${app.reverse('statuses')}/${1}`,
      payload: {
        data: testData.statuses.edited,
      },
      cookies: cookie,
    });
    expect(responseEdit.statusCode).toBe(302);
    const [status] = await models.status.query().findByIds(1);
    expect(status).toHaveProperty('name', 'новый статус');
  });

  it('test delete status', async () => {
    const response = await app.inject({
      method: 'delete',
      url: `${app.reverse('statuses')}/${5}`,
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);
    const bases = await models.status.query();
    expect(bases).toHaveLength(4);
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
