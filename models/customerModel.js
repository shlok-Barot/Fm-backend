// models/customerModel.js
const sql = require('mssql');
const poolPromise = require('../config/db.config');

class CustomerModel {
  async executeStoredProcedure(action, params) {
    const pool = await poolPromise;
    const request = pool.request();

    // Input parameters
    request.input('Action', sql.NVarChar(10), action);
    if (params.CustomerID) request.input('CustomerID', sql.Int, params.CustomerID);
    if (params.CustomerName) request.input('CustomerName', sql.NVarChar(100), params.CustomerName);
    if (params.CompanyID) request.input('CompanyID', sql.Int, params.CompanyID);
    if (params.ImportCode) request.input('ImportCode', sql.NVarChar(50), params.ImportCode);
    if (params.BillingCurrencyID) request.input('BillingCurrencyID', sql.Int, params.BillingCurrencyID);
    if (params.Website) request.input('Website', sql.NVarChar(200), params.Website);
    if (params.CustomerNotes) request.input('CustomerNotes', sql.NVarChar(255), params.CustomerNotes);
    if (params.IsInQuickBooks !== undefined) request.input('IsInQuickBooks', sql.Bit, params.IsInQuickBooks);
    if (params.QuickBookAccountID) request.input('QuickBookAccountID', sql.NChar(10), params.QuickBookAccountID);
    if (params.CustomerAddressID) request.input('CustomerAddressID', sql.Int, params.CustomerAddressID);
    if (params.CreatedByID) request.input('CreatedByID', sql.Int, params.CreatedByID);
    if (params.DeletedByID) request.input('DeletedByID', sql.Int, params.DeletedByID);

    // Output parameters
    request.output('Result', sql.Int);
    request.output('Message', sql.NVarChar(500));

    const result = await request.execute('ManageCustomer');
    
    return {
      result: result.output.Result,
      message: result.output.Message,
      data: action === 'SELECT' ? result.recordset : null
    };
  }

  async getCustomers(customerId = null) {
    return this.executeStoredProcedure('SELECT', { CustomerID: customerId });
  }

  async createCustomer(customerData) {
    return this.executeStoredProcedure('INSERT', customerData);
  }

  async updateCustomer(customerId, customerData) {
    customerData.CustomerID = customerId;
    return this.executeStoredProcedure('UPDATE', customerData);
  }

  async deleteCustomer(customerId, deletedById) {
    return this.executeStoredProcedure('DELETE', { 
      CustomerID: customerId, 
      DeletedByID: deletedById 
    });
  }
}

module.exports = new CustomerModel();