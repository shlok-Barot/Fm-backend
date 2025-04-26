const sql = require('mssql');
const poolPromise  = require('../config/db.config');

class SupplierModel {
  async getAllSuppliers(pageNumber = 1, pageSize = 10, fromDate = null, toDate = null) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('PageNumber', sql.Int, pageNumber);
      request.input('PageSize', sql.Int, pageSize);
      request.input('FromDate', sql.DateTime, fromDate);
      request.input('ToDate', sql.DateTime, toDate);
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('GetAllSuppliers');

      return {
        result: result.output.Result,
        message: result.output.Message,
        data: result.recordset || [],
      };
    } catch (err) {
      throw new Error(`Error fetching suppliers: ${err.message}`);
    }
  }

  async createSupplier(data) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), 'INSERT');
      request.input('SupplierName', sql.NVarChar(50), data.supplierName);
      request.input('SupplierGroupID', sql.Int, data.supplierGroupID || null);
      request.input('SupplierTypeID', sql.Int, data.supplierTypeID || null);
      request.input('SupplierAddressID', sql.Int, data.supplierAddressID || null);
      request.input('SupplierExportCode', sql.NVarChar(50), data.supplierExportCode || null);
      request.input('SAPartner', sql.Int, data.saPartner || null);
      request.input('SAPartnerExportCode', sql.NVarChar(50), data.saPartnerExportCode || null);
      request.input('BillingCurrencyID', sql.Int, data.billingCurrencyID || null);
      request.input('CompanyID', sql.Int, data.companyID || null);
      request.input('ExternalSupplierYN', sql.Bit, data.externalSupplierYN || null);
      request.input('UserID', sql.Int, data.userID || null);

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageSupplier');

      return {
        result: result.output.Result,
        message: result.output.Message,
        supplierID: result.recordset && result.recordset.length > 0 ? result.recordset[0].SupplierID : null,
      };
    } catch (err) {
      throw new Error(`Error creating supplier: ${err.message}`);
    }
  }

  async getSupplier(supplierID) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'SELECT');
      request.input('SupplierID', sql.Int, supplierID);
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageSupplier');

      return {
        result: result.output.Result,
        message: result.output.Message,
        data: result.recordset && result.recordset.length > 0 ? result.recordset[0] : null,
      };
    } catch (err) {
      throw new Error(`Error fetching supplier: ${err.message}`);
    }
  }

  async updateSupplier(supplierID, data) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'UPDATE');
      request.input('SupplierID', sql.Int, supplierID);
      request.input('SupplierName', sql.NVarChar(50), data.supplierName || null);
      request.input('SupplierGroupID', sql.Int, data.supplierGroupID || null);
      request.input('SupplierTypeID', sql.Int, data.supplierTypeID || null);
      request.input('SupplierAddressID', sql.Int, data.supplierAddressID || null);
      request.input('SupplierExportCode', sql.NVarChar(50), data.supplierExportCode || null);
      request.input('SAPartner', sql.Int, data.saPartner || null);
      request.input('SAPartnerExportCode', sql.NVarChar(50), data.saPartnerExportCode || null);
      request.input('BillingCurrencyID', sql.Int, data.billingCurrencyID || null);
      request.input('CompanyID', sql.Int, data.companyID || null);
      request.input('ExternalSupplierYN', sql.Bit, data.externalSupplierYN || null);
      request.input('UserID', sql.Int, data.userID || null);

      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageSupplier');

      return {
        result: result.output.Result,
        message: result.output.Message,
      };
    } catch (err) {
      throw new Error(`Error updating supplier: ${err.message}`);
    }
  }

  async deleteSupplier(supplierID, userID) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'DELETE');
      request.input('SupplierID', sql.Int, supplierID);
      request.input('UserID', sql.Int, userID || null);

      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageSupplier');

      return {
        result: result.output.Result,
        message: result.output.Message,
      };
    } catch (err) {
      throw new Error(`Error deleting supplier: ${err.message}`);
    }
  }
}

module.exports = new SupplierModel();