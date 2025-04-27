// require('dotenv').config();

// const Sequelize = require('sequelize');

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     dialect: process.env.DB_DIALECT,
//     host: process.env.DB_HOST,
//   }
// );

// sequelize
//   .authenticate()
//   .then(() => console.log('Database connected successfully!'))
//   .catch((err) => console.error('Error connecting to the database:', err));

// module.exports = sequelize;



 

// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('chatapp', 'root', 'Xmachin@123', {
// dialect: 'mysql',
// host: 'localhost'
// });

// module.exports = sequelize;

 


const Sequelize = require('sequelize');

require("dotenv").config();
 

const sequelize = new Sequelize('pgdb_ia58', 'vs', 'Im5paxhHFz1DAMG6whFpugHX33kUVRK9', {
  host: 'dpg-cvk591gdl3ps73fovbs0-a.oregon-postgres.render.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});


// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err.message);
  });


  module.exports = sequelize;