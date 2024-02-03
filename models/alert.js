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
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        }
    },
    targetPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    currencyPair: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direction: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Alert.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Alert, { foreignKey: 'userId' });
