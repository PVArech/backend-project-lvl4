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

console.log('environment', process.env.DATABASE_URL);
console.log('environment', process.env.NODE_ENV);
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
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
    migrations,
  },
};
