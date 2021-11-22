// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const tasks = await app.objection.models.task.query()
        .withGraphFetched({
          status: true,
          creatorUser: true,
          executorUser: true,
        });
      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = new app.objection.models.task();
      const users = await app.objection.models.user.query();
      const statuses = await app.objection.models.status.query();
      reply.render('tasks/new', { task, users, statuses });
      return reply;
    })
    .post('/tasks', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const task = {
          ...req.body.data,
          statusId: Number(req.body.data.statusId),
          creatorId: req.user.id,
          executorId: req.body.data.executorId || null,
        };
        const changes = await app.objection.models.task.fromJson(task);
        await app.objection.models.task.query().insert(changes);
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.create.error'));
        const users = await app.objection.models.user.query();
        const statuses = await app.objection.models.status.query();
        reply.render('tasks/new', {
          task: req.body.data,
          users,
          statuses,
          errors: data,
        });
        return reply;
      }
    })
    .get('/tasks/:id', { name: 'task', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const [task] = await app.objection.models.task.query().where({ id })
        .withGraphFetched({
          status: true,
          creatorUser: true,
          executorUser: true,
        });
      reply.render('tasks/view', { task });
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const [task] = await app.objection.models.task.query().where({ id });
      const users = await app.objection.models.user.query();
      const statuses = await app.objection.models.status.query();
      reply.render('tasks/edit', { task, users, statuses });
      return reply;
    })
    .patch('/tasks/:id', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { id } = req.params;
        const [data] = await app.objection.models.task.query().where({ id });
        const task = {
          ...req.body.data,
          statusId: Number(req.body.data.statusId),
          creatorId: data.creatorId,
          executorId: req.body.data.executorId || null,
        };
        const changes = await app.objection.models.task.fromJson(task);
        const result = await app.objection.models.task.query().findOne({ id });
        await result.$query().update(changes);
        req.flash('info', i18next.t('flash.tasks.update.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.update.error'));
        const users = await app.objection.models.user.query();
        const statuses = await app.objection.models.status.query();
        reply.render('tasks/edit', {
          task: { ...req.body.data, ...req.params },
          users,
          statuses,
          errors: data,
        });
        return reply;
      }
    })
    .delete('/tasks/:id', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { id } = req.params;
        const [task] = await app.objection.models.task.query().where({ id });
        if (task.creatorId !== req.user.id) {
          req.flash('error', i18next.t('flash.tasks.delete.error'));
          return reply.redirect(app.reverse('tasks'));
        }
        await app.objection.models.task.query().deleteById(id);
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        return reply.redirect(app.reverse('tasks'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.delete.errorForeign'));
        return reply.redirect(app.reverse('tasks'));
      }
    });
};
