// @ts-check

import i18next from 'i18next';
import _ from 'lodash';

const items = ['users', 'labels', 'statuses'];
const maps = {
  users: 'user',
  labels: 'label',
  statuses: 'status',
};

export default (app) => {
  const isCurrentUser = (req) => (Number(req.params.id) === req.user.id);
  const setFlash = (req, reply) => {
    req.flash('error', i18next.t('flash.users.delete.errorUser'));
    reply.redirect(app.reverse('users'));
  };
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
      })
      .get(`/${item}/:id/edit`, { name: `edit${_.upperFirst(maps[item])}`, preValidation: app.authenticate }, async (req, reply) => {
        const { id } = req.params;
        if (!isCurrentUser(req) && item === 'users') {
          setFlash(req, reply);
          return reply;
        }
        const [data] = await app.objection.models[maps[item]].query().where({ id });
        reply.render(`${item}/edit`, { [maps[item]]: data });
        return reply;
      })
      .post(`/${item}`, { preValidation: setPreValidation(item) }, async (req, reply) => {
        try {
          const records = await app.objection.models[maps[item]].fromJson(req.body.data);
          await app.objection.models[maps[item]].query().insert(records);
          req.flash('info', i18next.t(`flash.${item}.create.success`));
          reply.redirect(app.reverse(item === 'users' ? 'root' : item));
          return reply;
        } catch ({ data }) {
          req.flash('error', i18next.t(`flash.${item}.create.error`));
          reply.render(`${item}/new`, { [maps[item]]: req.body.data, errors: data });
          return reply;
        }
      })
      .patch(`/${item}/:id`, { name: `${maps[item]}`, preValidation: app.authenticate }, async (req, reply) => {
        try {
          const { id } = req.params;
          const changes = await app.objection.models[maps[item]].fromJson(req.body.data);
          const record = await app.objection.models[maps[item]].query().findOne({ id });
          await record.$query().update(changes);
          req.flash('info', i18next.t(`flash.${item}.update.success`));
          reply.redirect(app.reverse(item));
          return reply;
        } catch ({ data }) {
          req.flash('error', i18next.t(`flash.${item}.update.error`));
          reply.render(`${item}/edit`, { [maps[item]]: { ...req.body.data, ...req.params }, errors: data });
          return reply;
        }
      })
      .delete(`/${item}/:id`, { preValidation: app.authenticate }, async (req, reply) => {
        try {
          const { id } = req.params;
          if (!isCurrentUser(req) && item === 'users') {
            setFlash(req, reply);
            return reply;
          }
          await app.objection.models[maps[item]].query().deleteById(id);

          if (item === 'users') req.logOut();

          req.flash('info', i18next.t(`flash.${item}.delete.success`));
          return reply.redirect(app.reverse(item));
        } catch ({ data }) {
          req.flash('error', i18next.t(`flash.${item}.delete.error`));
          const records = await app.objection.models[maps[item]].query();
          reply.render(`${item}/index`, { [item]: records });
          return reply;
        }
      });
  });
};
