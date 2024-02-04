import { Sequelize } from "sequelize";

export const database = new Sequelize(process.env.DBNAME, process.env.USERNAME, process.env.PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
});