const User = require('./User');
const Charity = require('./Charity');
const Project = require('./Project');
const Donation = require('./Donation');
const Admin = require('./Admin');

// Associations
Charity.hasMany(Project, { foreignKey: 'charity_id' });
Project.belongsTo(Charity, { foreignKey: 'charity_id' });

User.hasMany(Donation, { foreignKey: 'user_id' });
Donation.belongsTo(User, { foreignKey: 'user_id' });

Charity.hasMany(Donation, { foreignKey: 'charity_id' });
Donation.belongsTo(Charity, { foreignKey: 'charity_id' });

module.exports = { User, Charity, Project, Donation, Admin };
