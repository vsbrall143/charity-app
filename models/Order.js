const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: {  // Foreign key for User
        type: Sequelize.UUID,
        allowNull: false,
    },
    charity_id: {  // Foreign key for Charity
        type: Sequelize.UUID,
        allowNull: false,
    },
    paymentid: {
        type: Sequelize.STRING,
    },
    orderid: {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.STRING,
    },
    amount: {
        type: Sequelize.INTEGER,
    }
});

module.exports = Order;
