const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fee = sequelize.define('Fee', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    class_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Class for which this fee is applicable'
    },
    fee_type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'e.g., Tuition, Exam, Library, Sports'
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    academic_year: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'e.g., 2024-2025'
    }
});

module.exports = Fee;
