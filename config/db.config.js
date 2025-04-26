// db.js
require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
  user: 'admin',
  password:  'Fleet_Monkey2025',
  server: 'fleetmonkey.c56goc4mudl6.eu-north-1.rds.amazonaws.com',
  database: 'Fleet_Monkey',
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true,
    connectTimeout: 15000,
  },
  pool: {
    max:  10,
    min:  0,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis:30000,
  },
  port: 1433,
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