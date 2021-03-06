// @ts-check

import BaseModel from './BaseModel';

export default class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'creatorId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        statusId: { type: 'integer', minimum: 1 },
        creatorId: { type: 'integer' },
      },
    };
  }

  static get modifiers() {
    return {
      setFilter(query, filter) {
        return filter.map(([name, value]) => (value ? query.where(name, value) : ''));
      },
      setFilterLabel(query, label) {
        if (label) {
          query.whereExists(function func() {
            this.select('*')
              .from('tasks_labels')
              .whereRaw('tasks.id = tasks_labels.task_id')
              .whereRaw('tasks_labels.label_id = ?', label);
          });
        }
      },
      setFilterCreatorUser(query, isCreatorUser, id) {
        return isCreatorUser ? query.where('creatorId', id) : '';
      },
    };
  }

  static get relationMappings() {
    return {
      statuses: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'Status',
        join: { from: 'tasks.statusId', to: 'statuses.id' },
      },
      creatorUsers: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User',
        join: { from: 'tasks.creatorId', to: 'users.id' },
      },
      executorUsers: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User',
        join: { from: 'tasks.executorId', to: 'users.id' },
      },
      labels: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: 'Label',
        join: {
          from: 'tasks.id',
          through: { from: 'tasks_labels.taskId', to: 'tasks_labels.labelId' },
          to: 'labels.id',
        },
      },
    };
  }
}
