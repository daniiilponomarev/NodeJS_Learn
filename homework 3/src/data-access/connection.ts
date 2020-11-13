import { Sequelize } from 'sequelize';

const DB_CONNECTION_URI = process.env.DB_CONNECTION_URI || '';

export const sequelize = new Sequelize(DB_CONNECTION_URI, {
  host: 'packy.db.elephantsql.com',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
