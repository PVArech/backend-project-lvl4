// @ts-check

import i18next from 'i18next';

export default (app) => {
  const modifyLabels = (changes) => {
    const data = changes;
    data.labels = [...changes.labels].map((value) => ({ id: value }));
  };
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const {
        status,
        executor,
        label,
        isCreatorUser,
      } = reply.request.query;
      const filter = [['statusId', status], ['executorId', executor]];
      const tasks = await app.objection.models.task.query()
        // .withGraphJoined('[statuses, creatorUsers, executorUsers, labels]')
        .withGraphFetched('[statuses, creatorUsers, executorUsers, labels]')
        .modify('setFilter', filter)
        .modify('setFilterLabel', label)
        .modify('setFilterCreatorUser', isCreatorUser, req.user.id);

      const users = await app.objection.models.user.query();
      const statuses = await app.objection.models.status.query();
      const labels = await app.objection.models.label.query();
      tasks.status = status;
      tasks.executor = executor;
      tasks.label = label;
      tasks.isCreatorUser = isCreatorUser;
      reply.render('tasks/index', {
        tasks,
        users,
        statuses,
        labels,
      });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = new app.objection.models.task();
      const users = await app.objection.models.user.query();
      const statuses = await app.objection.models.status.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/new', {
        task,
        users,
        statuses,
        labels,
      });
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

        // if (changes.labels) {
        //   changes.labels = [...changes.labels].map((value) => ({ id: value }));
        // }
        modifyLabels(changes);

        await app.objection.models.task.transaction(async (trx) => {
          await app.objection.models.task.query(trx).insertGraph([changes], { relate: ['labels'] });
        });

        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.create.error'));
        const users = await app.objection.models.user.query();
        const statuses = await app.objection.models.status.query();
        const labels = await app.objection.models.label.query();
        reply.render('tasks/new', {
          task: req.body.data,
          users,
          statuses,
          labels,
          errors: data,
        });
        return reply;
      }
    })
    .get('/tasks/:id', { name: 'task', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const [task] = await app.objection.models.task.query().where({ id })
        .withGraphFetched({
          statuses: true,
          creatorUsers: true,
          executorUsers: true,
          labels: true,
        });
      reply.render('tasks/view', { task });
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const [task] = await app.objection.models.task.query().where({ id })
        .withGraphFetched({ labels: true });
      task.labels = task.labels.map((item) => item.id.toString());
      const users = await app.objection.models.user.query();
      const statuses = await app.objection.models.status.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/edit', {
        task,
        users,
        statuses,
        labels,
      });
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
          id: Number(id),
        };
        const changes = await app.objection.models.task.fromJson(task);
        modifyLabels(changes);

        await app.objection.models.task.transaction(async (trx) => {
          await app.objection.models.task.query(trx).upsertGraph(changes, {
            relate: true,
            update: true,
            unrelate: true,
          });
        });

        req.flash('info', i18next.t('flash.tasks.update.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.update.error'));
        const users = await app.objection.models.user.query();
        const statuses = await app.objection.models.status.query();
        const labels = await app.objection.models.label.query();
        reply.render('tasks/edit', {
          task: { ...req.body.data, ...req.params },
          users,
          statuses,
          labels,
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
