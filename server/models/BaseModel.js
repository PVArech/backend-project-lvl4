import { Model } from 'objection';
import path from 'path';

export default class BaseModel extends Model {
  static get modelPaths() {
    return [path.join(__dirname)];
  }

  //   $beforeInsert() {
  //     this.created_at = new Date().toISOString();
  //   }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
