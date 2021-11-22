// @ts-check

// import { Model } from 'objection';
import objectionUnique from 'objection-unique';
import BaseModel from './BaseModel';

const unique = objectionUnique({ fields: ['name'] });

export default class Status extends unique(BaseModel) {
  static get tableName() {
    return 'statuses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    };
  }

  static get relationMappings() {
    return {
      status: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'Task',
        join: {
          from: 'statuses.id',
          to: 'tasks.statusId',
        },
      },
    };
  }
}
