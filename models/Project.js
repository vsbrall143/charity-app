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
  },
  imageUrl: {
    type: DataTypes.STRING, // Store the image path
    allowNull: true,
  },
  target: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  current: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = Project;
