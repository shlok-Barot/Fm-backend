const sql = require('mssql'); 
const poolPromise  = require('../config/db.config');

// Default values for pagination
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;

class CompanyModel {
  async getAllCompanies(pageNumber = DEFAULT_PAGE_NUMBER, pageSize = DEFAULT_PAGE_SIZE, fromDate = null, toDate = null) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      // Input parameters
      request.input('PageNumber', sql.Int, pageNumber);
      request.input('PageSize', sql.Int, pageSize);
      request.input('FromDate', sql.DateTime, fromDate);
      request.input('ToDate', sql.DateTime, toDate);
      
      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('GetAllCompanies');
      
      return {
        result: result.output.Result,
        message: result.output.Message,
        companies: result.recordset || [],
      };
    } catch (err) {
      throw new Error(`Error fetching companies: ${err.message}`);
    }
  }

  async createCompany(data) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      // Input parameters
      request.input('Action', sql.Char(50), 'INSERT');
      request.input('CompanyName', sql.NVarChar(100), data.companyName);
      request.input('CompanyTypeID', sql.Int, data.companyTypeID || null);
      request.input('BillingCurrencyID', sql.Int, data.billingCurrencyID || null);
      request.input('VAT_Account', sql.NVarChar(50), data.vatAccount || null);
      request.input('Website', sql.NVarChar(200), data.website || null);
      request.input('CompanyNotes', sql.NVarChar(255), data.companyNotes || null);
      request.input('CompanyAddressID', sql.Int, data.companyAddressID || null);
      request.input('CreatedByID', sql.Int, data.createdByID || null);
      
      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(255));

      const result = await request.execute('ManageCompany');
      
      return {
        result: result.output.Result,
        message: result.output.Message,
        companyID: result.recordset && result.recordset.length > 0 ? result.recordset[0].CompanyID : null,
      };
    } catch (err) {
      throw new Error(`Error creating company: ${err.message}`);
    }
  }

  async getCompany(companyID) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('Action', sql.Char(50), 'SELECT');
      request.input('CompanyID', sql.Int, companyID);
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(255));

      const result = await request.execute('ManageCompany');
      
      return {
        result: result.output.Result,
        message: result.output.Message,
        data: result.recordset && result.recordset.length > 0 ? result.recordset[0] : null,
      };
    } catch (err) {
      throw new Error(`Error fetching company: ${err.message}`);
    }
  }

  async updateCompany(companyID, data) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('Action', sql.Char(50), 'UPDATE');
      request.input('CompanyID', sql.Int, companyID);
      request.input('CompanyName', sql.NVarChar(100), data.companyName || null);
      request.input('CompanyTypeID', sql.Int, data.companyTypeID || null);
      request.input('BillingCurrencyID', sql.Int, data.billingCurrencyID || null);
      request.input('VAT_Account', sql.NVarChar(50), data.vatAccount || null);
      request.input('Website', sql.NVarChar(200), data.website || null);
      request.input('CompanyNotes', sql.NVarChar(255), data.companyNotes || null);
      request.input('CompanyAddressID', sql.Int, data.companyAddressID || null);
      request.input('CreatedByID', sql.Int, data.createdByID || null);
      
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(255));

      const result = await request.execute('ManageCompany');
      
      return {
        result: result.output.Result,
        message: result.output.Message,
      };
    } catch (err) {
      throw new Error(`Error updating company: ${err.message}`);
    }
  }

  async deleteCompany(companyID, createdByID) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('Action', sql.Char(50), 'DELETE');
      request.input('CompanyID', sql.Int, companyID);
      request.input('CreatedByID', sql.Int, createdByID || null);
      
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(255));

      const result = await request.execute('ManageCompany');
      
      return {
        result: result.output.Result,
        message: result.output.Message,
      };
    } catch (err) {
      throw new Error(`Error deleting company: ${err.message}`);
    }
  }
}

module.exports = new CompanyModel();