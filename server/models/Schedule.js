const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Schedule = sequelize.define('Schedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    class_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    day_of_week: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday'
    },
    start_time: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Format: HH:MM (24-hour)'
    },
    end_time: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Format: HH:MM (24-hour)'
    }
});

module.exports = Schedule;
