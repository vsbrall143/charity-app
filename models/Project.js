const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  charity_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Charities', // References the Charity model
      key: 'id',
    },
    onDelete: 'CASCADE', // Deletes associated projects if the charity is deleted
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = Project;
