const { Sequelize } = require('sequelize');
const config = require('./sequelize');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected successfully (Sequelize)');
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
  }
};

testConnection();

module.exports = sequelize;
