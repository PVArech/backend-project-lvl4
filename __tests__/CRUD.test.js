// @ts-check

import _ from 'lodash';
import getApp from '../server/index.js';
import { getTestData, prepareData } from './helpers/index.js';
import encrypt from '../server/lib/secure.js';

describe('test session', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();
  let cookie;
  const { email } = testData.users.existing;
  let currentUser;

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    await knex.migrate.latest();
    await prepareData(app);
    models = app.objection.models;
    currentUser = await models.user.query().findOne({ email });
  });

  it('test create', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: params,
      },
    });
    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  it('test read', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });
    expect(response.statusCode).toBe(200);
    const bases = await models.user.query();
    expect(bases).toHaveLength(4);
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

  it('test edit not authentication', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `${app.reverse('users')}/${currentUser.id}/edit`,
    });
    expect(response.statusCode).toBe(302);
  });

  it('test edit', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `${app.reverse('users')}/${currentUser.id}/edit`,
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);

    const responseEdit = await app.inject({
      method: 'patch',
      url: `${app.reverse('users')}/${currentUser.id}`,
      payload: {
        data: testData.users.edited,
      },
      cookies: cookie,
    });
    expect(responseEdit.statusCode).toBe(302);
    const [user] = await models.user.query().findByIds(currentUser.id);
    expect(user).toHaveProperty('firstName', 'Gleb');
  });

  it('test edit other user', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `${app.reverse('users')}/${currentUser.id - 1}/edit`,
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);
  });

  it('test delete not authentication', async () => {
    const response = await app.inject({
      method: 'delete',
      url: `${app.reverse('users')}/${currentUser.id}`,
      payload: {
        data: testData.users.new,
      },
    });
    expect(response.statusCode).toBe(302);
    const bases = await models.user.query();
    expect(bases).toHaveLength(4);
  });

  it('test delete other user', async () => {
    const response = await app.inject({
      method: 'delete',
      url: `${app.reverse('users')}/${currentUser.id - 1}`,
      payload: {
        data: testData.users.new,
      },
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);
    const bases = await models.user.query();
    expect(bases).toHaveLength(4);
  });

  it('test delete', async () => {
    const response = await app.inject({
      method: 'delete',
      url: `${app.reverse('users')}/${currentUser.id}`,
      payload: {
        data: testData.users.new,
      },
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);
    const bases = await models.user.query();
    expect(bases).toHaveLength(3);
  });

  it('test sign out', async () => {
    const responseSignOut = await app.inject({
      method: 'DELETE',
      url: app.reverse('session'),
      cookies: cookie,
    });
    expect(responseSignOut.statusCode).toBe(500);
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    app.close();
  });
});
