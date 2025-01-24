const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const Admin = sequelize.define('Admin', {
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
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Password hashing before creating a new admin
Admin.beforeCreate(async (admin) => {
  const hashedPassword = await bcrypt.hash(admin.password, 10);
  admin.password = hashedPassword;
});

// Optional: Add beforeUpdate for password change
Admin.beforeUpdate(async (admin) => {
  if (admin.changed('password')) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    admin.password = hashedPassword;
  }
});

module.exports = Admin;
