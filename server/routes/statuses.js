import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses', preValidation: app.authenticate }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus', preValidation: app.authenticate }, (req, reply) => {
      const status = new app.objection.models.status();
      reply.render('statuses/new', { status });
    })
    .get('/statuses/:id/edit', { preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const [status] = await app.objection.models.status.query().where({ id });
      reply.render('statuses/edit', { status });
      return reply;
    })
    .post('/statuses', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const status = await app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().insert(status);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status: req.body.data, errors: data });
        return reply;
      }
    })
    .patch('/statuses/:id', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { id } = req.params;
        const changes = await app.objection.models.status.fromJson(req.body.data);
        const status = await app.objection.models.status.query().findOne({ id });
        await status.$query().update(changes);
        req.flash('info', i18next.t('flash.statuses.update.success'));
        reply.redirect(app.reverse('statuses'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.update.error'));
        reply.render('statuses/edit', { status: { ...req.body.data, ...req.params }, errors: data });
        return reply;
      }
    })
    .delete('/statuses/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      await app.objection.models.status.query().where({ id }).del();
      req.flash('info', i18next.t('flash.statuses.delete.success'));
      return reply.redirect(app.reverse('statuses'));
    });
};
