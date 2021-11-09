// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .get('/users/:idUser/edit', { preValidation: app.authenticate }, async (req, reply) => {
      const { idUser } = req.params;
      const { id } = req.user;
      if (Number(idUser) !== id) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply.redirect(app.reverse('users'));
      }
      const [user] = await app.objection.models.user.query().where('id', idUser);
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
    .patch('/users/:idUser', async (req, reply) => {
      const { idUser } = req.params;
      reply.send(`edit user ${idUser}`);
    })
    .delete('/users/:idUser', { preValidation: app.authenticate }, async (req, reply) => {
      const { idUser } = req.params;
      const { id } = req.user;
      if (Number(idUser) !== id) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply.redirect(app.reverse('users'));
      }
      await app.objection.models.user.query().where('id', idUser).del();
      req.logOut();
      req.flash('info', i18next.t('flash.users.delete.success'));
      return reply.redirect(app.reverse('users'));
    });
};
