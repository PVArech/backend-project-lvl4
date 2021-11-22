import _ from 'lodash';
import getApp from '../server/index.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('tests not Authenticated', () => {
  let app;
  let knex;
  const testData = getTestData();
  const {
    verbs,
    routes,
    routesNew,
    routesEdit,
    routesId,
  } = testData;
  const id = 1;
  const status = {
    GET: 302,
    POST: 302,
    PATCH: 404,
    DELETE: 404,
  };

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    await knex.migrate.latest();
    await prepareData(app);
  });

  describe.each(_.difference(verbs, ['PATCH', 'DELETE']))('test %s /route', (verb) => {
    it.each(routes)(`${verb} /%s`, async (route) => {
      const response = await app.inject({
        method: verb,
        url: app.reverse(route),
        payload: verb === 'POST' ? { data: testData[route].new } : '',
      });
      const expected = (route === 'users' && verb === 'GET') ? 200 : status[verb];
      expect(response.statusCode).toBe(expected);
    });
  });

  describe('test GET /route/new', () => {
    it.each(routesNew)('GET /%s', async (route) => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse(route),
      });
      const expected = route === 'newUser' ? 200 : 302;
      expect(response.statusCode).toBe(expected);

      const tree = response.body;
      expect(tree).toMatchSnapshot();
    });
  });

  describe('test GET /route/:id/edit', () => {
    it.each(routesEdit)('GET /%s', async (route) => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse(route, { id }),
      });
      expect(response.statusCode).toBe(302);
    });
  });

  describe.each(_.difference(verbs, ['POST']))('test %s /route/:id', (verb) => {
    it.each(routesId)(`test ${verb} /%s=${id}`, async (route) => {
      const response = await app.inject({
        method: verb,
        url: app.reverse(route, { id }),
      });
      const expected = (route !== 'task' && verb === 'GET') ? 404 : 302;
      expect(response.statusCode).toBe(expected);
    });
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    app.close();
  });
});
