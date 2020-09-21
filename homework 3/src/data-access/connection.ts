import { Sequelize } from 'sequelize';

const DB_CONNECTION_URI =
  'postgres://syxisznz:H-3ENhFKqxs3CpwkndGDaDW1h9kWOzMS@packy.db.elephantsql.com:5432/syxisznz';

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
