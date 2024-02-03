import { DataTypes } from "sequelize";
import { database } from "../database/database.js";
import { User } from "./user.js";

export const Alert = database.define('Alert', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    targetPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Alert.belongsTo(User);
User.hasMany(Alert);
