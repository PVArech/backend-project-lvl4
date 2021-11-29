// @ts-check

import i18next from 'i18next';

export default (app) => {
  const isCurrentUser = (req) => (Number(req.params.id) === req.user.id);
  const setFlash = (req, reply) => {
    req.flash('error', i18next.t('flash.users.delete.error'));
    reply.redirect(app.reverse('users'));
  };
  app
    .get('/users/:id/edit', { name: 'editUser', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      if (!isCurrentUser(req)) {
        setFlash(req, reply);
        return reply;
      }
      const [user] = await app.objection.models.user.query().where({ id });
      reply.render('users/edit', { user });
      return reply;
    })
    .post('/users', async (req, reply) => {
      try {
        const user = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(user);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: req.body.data, errors: data });
        return reply;
      }
    })
    .patch('/users/:id', { name: 'user', preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { id } = req.params;
        const changes = await app.objection.models.user.fromJson(req.body.data);
        const user = await app.objection.models.user.query().findOne({ id });
        await user.$query().update(changes);
        req.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect(app.reverse('users'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.update.error'));
        reply.render('users/edit', { user: { ...req.body.data, ...req.params }, errors: data });
        return reply;
      }
    })
    .delete('/users/:id', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { id } = req.params;
        if (!isCurrentUser(req)) {
          setFlash(req, reply);
          return reply;
        }
        await app.objection.models.user.query().deleteById(id);
        req.logOut();
        req.flash('info', i18next.t('flash.users.delete.success'));
        return reply.redirect(app.reverse('users'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.delete.errorForeign'));
        const users = await app.objection.models.user.query();
        reply.render('users/index', { users });
        return reply;
      }
    });
};
