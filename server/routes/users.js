// @ts-check

import i18next from 'i18next';

export default (app) => {
  app // GET /users страница со списком всех пользователей
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    }) // GET /users/new - страница регистрации
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    }) // POST /users - создание пользователя
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
    }) // GET /users/:id/edit - страница редактирования пользователя
    .get('/users/:idUser/edit', async (req, reply) => {
      const { idUser } = req.params;
      const [user] = await app.objection.models.user.query().where('id', idUser);
      user.password = user.passwordDigest;
      console.log('%%%%%%%%%%%%', user, user.passwordDigest);
      reply.render('users/edit', { user });
      return reply;
    });
};
