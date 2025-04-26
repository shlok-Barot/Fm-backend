require('dotenv').config(); // Add dotenv at the top
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const poolPromise = require('./config/db.config'); // Use the updated db config
const salesRFQRoutes = require('./routes/salesRFQRoutes');
const customerRoutes = require('./routes/customerRoutes');
const companyRoutes = require('./routes/companyRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const serviceTypeRoutes = require('./routes/serviceTypeRoutes');
// const salesRFQParcelRoutes = require('./routes/salesRFQParcelRoutes');
const addressRoutes = require('./routes/addressRoutes');
const mailingPriorityRoutes = require('./routes/mailingPriorityRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const salesRFQApprovalRoutes = require('./routes/salesRFQApprovalRoutes');
const personRoutes = require('./routes/personRoutes');
const personTypeRoutes = require('./routes/personTypeRoutes');
const purchaseRFQRoutes = require('./routes/purchaseRFQRoutes');
const itemRoutes = require('./routes/itemRoutes');
const uomRoutes = require('./routes/uomRoutes');
const authRoutes = require('./routes/authRoutes');
const cityRoutes = require('./routes/cityRoutes');
const countryOfOriginRoutes = require('./routes/countryOfOriginRoutes');
const addressTypeRoutes = require('./routes/addressTypeRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const bankAccountRoutes = require('./routes/bankAccountRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const RolesRoutes = require('./routes/rolesRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
// const rolePermissionRoutes = require('./routes/rolePermissionRoutes');
const rolePermissionRoutes = require('./routes/rolePermissionroutes');

 


const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN,
    "http://localhost:3000",
    "http://localhost:5173"
    ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize server
async function startServer() {
  try {
    // Wait for database connection
    const pool = await poolPromise;
    
    // Mount routes with validation
    const routes = [
      ['/api/sales-rfq', salesRFQRoutes],
      ['/api/customers', customerRoutes],
      ['/api/companies', companyRoutes],
      ['/api/suppliers', supplierRoutes],
      ['/api/service-types', serviceTypeRoutes],
      // ['/api/sales-rfq-parcels', salesRFQParcelRoutes],
      ['/api/addresses', addressRoutes],
      ['/api/mailing-priorities', mailingPriorityRoutes],
      ['/api/currencies', currencyRoutes],
      ['/api/sales-rfq-approvals', salesRFQApprovalRoutes],
      ['/api/persons', personRoutes],
      ['/api/person-types', personTypeRoutes],
      ['/api/purchase-rfq', purchaseRFQRoutes],
      ['/api/items', itemRoutes],
      ['/api/uoms', uomRoutes],
      ['/api/auth', authRoutes],
      ['/api/cities', cityRoutes],
     [ '/api/country-of-origin', countryOfOriginRoutes],
      ['/api/address-types', addressTypeRoutes],
      ['/api/warehouses', warehouseRoutes],
      ['/api/vehicles', vehicleRoutes],
      ['/api/bank-accounts', bankAccountRoutes],
      ['/api/certifications', certificationRoutes],
      ['/api/roles', RolesRoutes],
      ['/api/permissions',permissionRoutes],
      // ['/api/rolepermissions',rolePermissionRoutes],
      ['/api/rolepermissions',rolePermissionRoutes]
    ];

    routes.forEach(([path, route]) => {
      if (!route) {
        throw new Error(`Route module not properly imported for ${path}`);
      }
      app.use(path, route);
      console.log(`Mounted route: ${path}`);
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Application Error:', err.stack);
      res.status(500).json({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });

    const PORT = process.env.PORT || 7000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`Received ${signal}. Shutting down...`);
      try {
        server.close(() => {
          console.log('HTTP server closed');
        });
        
        if (pool) {
          await pool.close();
          console.log('Database pool closed');
        }
        
        process.exit(0);
      } catch (err) {
        console.error('Shutdown error:', err);
        process.exit(1);
      }
    };

    // Handle process signals
    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, () => shutdown(signal));
    });

    // Handle uncaught errors
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      shutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      shutdown('unhandledRejection');
    });

    return pool;
  } catch (err) {
    console.error('Server initialization failed:', err);
    process.exit(1);
  }
}

// Start the server
startServer()
  .then(() => console.log('Server initialization complete'))
  .catch(err => {
    console.error('Fatal error during server startup:', err);
    process.exit(1);
  });

// Export pool getter
module.exports = { 
  getPool: async () => {
    try {
      return await poolPromise;
    } catch (err) {
      throw new Error(`Failed to get database pool: ${err.message}`);
    }
  }
};