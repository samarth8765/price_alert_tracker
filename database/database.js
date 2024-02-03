import { Sequelize } from "sequelize";

export const database = new Sequelize(process.env.DBNAME, process.env.USERNAME, process.env.PASSWORD, {
    host: '172.17.0.2',
    dialect: 'postgres',
    logging: false
});