// @ts-check

import welcome from './welcome.js';
import session from './session.js';
import tasks from './tasks.js';
import routes from './routes.js';

const controllers = [
  welcome,
  session,
  routes,
  tasks,
];

export default (app) => controllers.forEach((f) => f(app));
