// @ts-check

const path = require('path');
const dotenv = require('dotenv');
const pg = require('pg');

dotenv.config();

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = { rejectUnauthorized: false };
}

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

const pathSeeds = {
  directory: path.join(__dirname, 'server', 'migrations', 'seeds'),
};

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite',
    },
    useNullAsDefault: true,
    migrations,
    seeds: pathSeeds,
    debug: true,
    pool: {
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      },
    },
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations,
    pool: {
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      },
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations,
    seeds: pathSeeds,
  },
};
