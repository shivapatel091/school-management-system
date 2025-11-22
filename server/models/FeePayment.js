const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Fee = require('./Fee');

const FeePayment = sequelize.define('FeePayment', {
    amount_paid: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    }
});

FeePayment.belongsTo(Fee, { foreignKey: 'fee_id' });
Fee.hasMany(FeePayment, { foreignKey: 'fee_id' });

module.exports = FeePayment;
