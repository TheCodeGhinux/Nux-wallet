import type { Knex } from 'knex';
import dotenv from 'dotenv';
dotenv.config();
// Update with your config settings.


const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },

    migrations: {
      directory: './src/db/migrations',
      // tableName: 'lendsqldb',
    },
    seeds: {
      directory: './src/db/seeds',
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'mysq;',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },

    migrations: {
      directory: './src/db/migrations',
      // tableName: 'lendsqldb',
    },
    seeds: {
      directory: './src/db/seeds',
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },

    migrations: {
      directory: './src/db/migrations',
      // tableName: 'lendsqldb',
    },
    seeds: {
      directory: './src/db/seeds',
    },
    useNullAsDefault: true,
  },
};

module.exports = config;