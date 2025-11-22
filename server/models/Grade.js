const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');

const Grade = sequelize.define('Grade', {
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    max_score: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    term: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Grade.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(Grade, { foreignKey: 'student_id' });

module.exports = Grade;
