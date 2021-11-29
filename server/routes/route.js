// @ts-check

// import i18next from 'i18next';
import _ from 'lodash';

const items = ['users', 'labels', 'statuses'];
const maps = {
  users: 'user',
  labels: 'label',
  statuses: 'status',
};

export default (app) => {
  const setPreValidation = (item) => (item === 'users' ? false : app.authenticate);

  items.forEach((item) => {
    app
      .get(`/${item}`, { name: `${item}`, preValidation: setPreValidation(item) }, async (req, reply) => {
        const data = await app.objection.models[maps[item]].query();
        reply.render(`${item}/index`, { [item]: data });
        return reply;
      })
      .get(`/${item}/new`, { name: `new${_.upperFirst(maps[item])}`, preValidation: setPreValidation(item) }, (req, reply) => {
        const data = new app.objection.models[maps[item]]();
        reply.render(`${item}/new`, { [maps[item]]: data });
        return reply;
      });
  });
};
