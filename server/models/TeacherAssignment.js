const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeacherAssignment = sequelize.define('TeacherAssignment', {
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
    }
});

module.exports = TeacherAssignment;
