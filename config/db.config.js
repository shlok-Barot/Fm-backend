// db.js
require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
  user: 'sa',
  password:  'sa123',
  server: '192.168.1.24',
  database: 'Fleet_Monkey',
  options: {
    encrypt: 'development',
    trustServerCertificate: 'development',
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