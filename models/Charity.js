const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Charity = sequelize.define('Charity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  password: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  mission: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location:{
    type: DataTypes.TEXT,
    allowNull: false,
  },
  registrationNumber: {
    type: DataTypes.STRING,
    allowNull: false, 
    unique: true, 
  },
  approve: {
    type: DataTypes.INTEGER,
    defaultValue:0
  }

}, {
  timestamps: true,
});

module.exports = Charity;