const sql = require('mssql');
const poolPromise = require('../config/db.config');

class SalesRFQParcelModel {
  static async executeStoredProcedure(action, params = {}) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), action);
      if (params.SalesRFQParcelID) request.input('SalesRFQParcelID', sql.Int, params.SalesRFQParcelID);
      if (params.SalesRFQID) request.input('SalesRFQID', sql.Int, params.SalesRFQID);
      if (params.ItemID) request.input('ItemID', sql.Int, params.ItemID);
      if (params.LineItemNumber) request.input('LineItemNumber', sql.Int, params.LineItemNumber);
      if (params.ItemQuantity) request.input('ItemQuantity', sql.Decimal(14, 4), params.ItemQuantity);
      if (params.UOMID) request.input('UOMID', sql.Int, params.UOMID);
      if (params.CreatedByID) request.input('CreatedByID', sql.Int, params.CreatedByID);
      if (params.IsDeleted !== undefined) request.input('IsDeleted', sql.Bit, params.IsDeleted);
      if (params.DeletedDateTime) request.input('DeletedDateTime', sql.DateTime, new Date(params.DeletedDateTime));
      if (params.DeletedByID) request.input('DeletedByID', sql.Int, params.DeletedByID);

      // Output parameter
      request.output('NewSalesRFQParcelID', sql.Int);

      // Execute stored procedure
      const result = await request.execute('ManageSalesRFQParcel');

      return {
        output: {
          NewSalesRFQParcelID: result.output.NewSalesRFQParcelID
        },
        recordset: result.recordset
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async getAllSalesRFQParcels() {
    return this.executeStoredProcedure('SELECT');
  }

  static async getSalesRFQParcelById(id) {
    return this.executeStoredProcedure('SELECT', { SalesRFQParcelID: id });
  }

  static async createSalesRFQParcel(data) {
    return this.executeStoredProcedure('INSERT', data);
  }

  static async updateSalesRFQParcel(id, data) {
    return this.executeStoredProcedure('UPDATE', { SalesRFQParcelID: id, ...data });
  }

  static async deleteSalesRFQParcel(id, deletedByID) {
    return this.executeStoredProcedure('DELETE', { SalesRFQParcelID: id, DeletedByID: deletedByID });
  }
}

module.exports = SalesRFQParcelModel;