const sql = require('mssql');
const poolPromise = require('../config/db.config');

class SalesRFQModel {
  static async executeStoredProcedure(action, params = {}, procedureName = 'ManageSalesRFQ') {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), action);
      if (params.SalesRFQID) request.input('SalesRFQID', sql.Int, params.SalesRFQID);
      if (params.Series) request.input('Series', sql.NVarChar(50), params.Series);
      if (params.CompanyID) request.input('CompanyID', sql.Int, params.CompanyID);
      if (params.CustomerID) request.input('CustomerID', sql.Int, params.CustomerID);
      if (params.SupplierID) request.input('SupplierID', sql.Int, params.SupplierID);
      if (params.ExternalRefNo) request.input('ExternalRefNo', sql.NVarChar(50), params.ExternalRefNo);
      if (params.ExternalSupplierID) request.input('ExternalSupplierID', sql.Int, params.ExternalSupplierID);
      if (params.DeliveryDate) request.input('DeliveryDate', sql.DateTime, new Date(params.DeliveryDate));
      if (params.PostingDate) request.input('PostingDate', sql.DateTime, new Date(params.PostingDate));
      if (params.RequiredByDate) request.input('RequiredByDate', sql.DateTime, new Date(params.RequiredByDate));
      if (params.DateReceived) request.input('DateReceived', sql.DateTime, new Date(params.DateReceived));
      if (params.ServiceTypeID) request.input('ServiceTypeID', sql.Int, params.ServiceTypeID);
      if (params.OriginAddressID) request.input('OriginAddressID', sql.Int, params.OriginAddressID);
      if (params.CollectionAddressID) request.input('CollectionAddressID', sql.Int, params.CollectionAddressID);
      if (params.Status) request.input('Status', sql.NVarChar(50), params.Status);
      if (params.DestinationAddressID) request.input('DestinationAddressID', sql.Int, params.DestinationAddressID);
      if (params.BillingAddressID) request.input('BillingAddressID', sql.Int, params.BillingAddressID);
      if (params.ShippingPriorityID) request.input('ShippingPriorityID', sql.Int, params.ShippingPriorityID);
      if (params.Terms) request.input('Terms', sql.NVarChar(50), params.Terms);
      if (params.CurrencyID) request.input('CurrencyID', sql.Int, params.CurrencyID);
      if (params.CollectFromSupplierYN !== undefined) request.input('CollectFromSupplierYN', sql.Bit, params.CollectFromSupplierYN);
      if (params.PackagingRequiredYN !== undefined) request.input('PackagingRequiredYN', sql.Bit, params.PackagingRequiredYN);
      if (params.FormCompletedYN !== undefined) request.input('FormCompletedYN', sql.Bit, params.FormCompletedYN);

      // Output parameters
      request.output('NewSalesRFQID', sql.Int);
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(255));

      // Execute stored procedure
      const result = await request.execute(procedureName);

      return {
        output: {
          NewSalesRFQID: result.output.NewSalesRFQID,
          Result: result.output.Result,
          Message: result.output.Message
        },
        recordset: result.recordset
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async getAllSalesRFQs(pageNumber = 1, pageSize = 10, fromDate = null, toDate = null, dateField = 'CreatedDateTime') {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('PageNumber', sql.Int, pageNumber);
      request.input('PageSize', sql.Int, pageSize);
      request.input('FromDate', sql.Date, fromDate);
      request.input('ToDate', sql.Date, toDate);
      request.input('DateField', sql.NVarChar(50), dateField);

      // Output parameter for total records
      request.output('TotalRecords', sql.Int);

      const result = await request.execute('FM_GetAllSalesRFQs');

      return {
        data: result.recordset,
        pagination: {
          totalRecords: result.output.TotalRecords,
          currentPage: pageNumber,
          pageSize: pageSize,
          totalPages: Math.ceil(result.output.TotalRecords / pageSize)
        }
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async getSalesRFQById(id) {
    return this.executeStoredProcedure('SELECT', { SalesRFQID: id });
  }

  static async createSalesRFQ(data) {
    return this.executeStoredProcedure('INSERT', data);
  }

  static async updateSalesRFQ(id, data) {
    return this.executeStoredProcedure('UPDATE', { SalesRFQID: id, ...data });
  }

  static async deleteSalesRFQ(id) {
    return this.executeStoredProcedure('DELETE', { SalesRFQID: id });
  }
}

module.exports = SalesRFQModel;