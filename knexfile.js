// @ts-check

const path = require('path');

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite',
    },
    useNullAsDefault: true,
    migrations,
    debug: true,
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations,
  },
  production: {
    client: 'pg',
    connection: {
      host: 'ec2-54-224-142-15.compute-1.amazonaws.com',
      database: 'df31cf8909etsa',
      user: 'sutintnudtdrah',
      port: '5432',
      password: 'd9e98f1c60443b5c6afc3c9f5cbad481be8af6c82bc677a7c4a0914dcce40b2a',
    },
    migrations,
  },
};
