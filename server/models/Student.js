const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roll_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    class: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Active'
    },
    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true
    },
    blood_group: {
        type: DataTypes.STRING,
        allowNull: true
    },
    aadhar_number: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    parent_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    parent_phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    parent_email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    photo_url: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'URL or path to student photo'
    }
});

module.exports = Student;
