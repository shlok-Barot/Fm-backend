// db.js
require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'sa123',
  server: process.env.DB_SERVER || 'DELL-SYSTEM',
  database: process.env.DB_NAME || 'Fleet_Monkey_V1',
  options: {
    encrypt: process.env.NODE_ENV === 'production',
    trustServerCertificate: process.env.NODE_ENV !== 'production',
    enableArithAbort: true,
    connectTimeout: 15000,
  },
  pool: {
    max: parseInt(process.env.DB_POOL_MAX) || 10,
    min: parseInt(process.env.DB_POOL_MIN) || 0,
    idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE) || 30000,
    acquireTimeoutMillis: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
  },
  port: parseInt(process.env.DB_PORT) || 1433,
};

if (!dbConfig.user || !dbConfig.password || !dbConfig.server || !dbConfig.database) {
  throw new Error('Database configuration is missing required credentials');
}

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    throw err;
  });

module.exports = poolPromise;