import i18next from 'i18next';

export default (app) => {
  app
    .get('/labels/:id/edit', { name: 'editLabel', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const [label] = await app.objection.models.label.query().where({ id });
      reply.render('labels/edit', { label });
      return reply;
    })
    .post('/labels', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const label = await app.objection.models.label.fromJson(req.body.data);
        await app.objection.models.label.query().insert(label);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('labels'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label: req.body.data, errors: data });
        return reply;
      }
    })
    .patch('/labels/:id', { name: 'label', preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { id } = req.params;
        const changes = await app.objection.models.label.fromJson(req.body.data);
        const label = await app.objection.models.label.query().findOne({ id });
        await label.$query().update(changes);
        req.flash('info', i18next.t('flash.labels.update.success'));
        reply.redirect(app.reverse('labels'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.update.error'));
        reply.render('labels/edit', { label: { ...req.body.data, ...req.params }, errors: data });
        return reply;
      }
    })
    .delete('/labels/:id', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { id } = req.params;
        await app.objection.models.label.query().deleteById(id);
        req.flash('info', i18next.t('flash.labels.delete.success'));
        return reply.redirect(app.reverse('labels'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.delete.error'));
        const labels = await app.objection.models.label.query();
        reply.render('labels/index', { labels });
        return reply;
      }
    });
};
