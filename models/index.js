const User = require('./User');
const Charity = require('./Charity');
const Project = require('./Project');
const Order = require('./Order');
const Admin = require('./Admin');

// Associations
Charity.hasMany(Project, { foreignKey: 'charity_id', onDelete: 'CASCADE' });
Project.belongsTo(Charity, { foreignKey: 'charity_id' });

User.hasMany(Order, { foreignKey: 'user_id', as: 'userOrders', onDelete: 'CASCADE' });  
Order.belongsTo(User, { foreignKey: 'user_id', as: 'orderUser' }); // Changed alias from "user" to "orderUser"

Charity.hasMany(Order, { foreignKey: 'charity_id', as: 'charityOrders', onDelete: 'CASCADE' });  
Order.belongsTo(Charity, { foreignKey: 'charity_id', as: 'orderCharity' }); // Changed alias from "charity" to "orderCharity"

module.exports = { User, Charity, Project, Order, Admin };
