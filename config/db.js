require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
  }
);

sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => console.error('Error connecting to the database:', err));

module.exports = sequelize;
