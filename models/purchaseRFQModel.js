const sql = require('mssql');
const poolPromise = require('../config/db.config');

class PurchaseRFQModel {
  static async executeStoredProcedure(action, params = {}) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(20), action);
      if (params.SalesRFQID) request.input('SalesRFQID', sql.Int, params.SalesRFQID);
      if (params.PurchaseRFQID) request.input('PurchaseRFQID', sql.Int, params.PurchaseRFQID);
      if (params.CreatedByID) request.input('CreatedByID', sql.Int, params.CreatedByID);
      if (params.DeletedByID) request.input('DeletedByID', sql.Int, params.DeletedByID);

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));
      request.output('NewPurchaseRFQID', sql.Int);

      // Execute stored procedure
      const result = await request.execute('ManagePurchaseRFQ');

      return {
        output: {
          Result: result.output.Result,
          Message: result.output.Message,
          NewPurchaseRFQID: result.output.NewPurchaseRFQID
        },
        recordset: result.recordset
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async getAllPurchaseRFQs() {
    return this.executeStoredProcedure('SELECT_ALL');
  }

  static async getPurchaseRFQById(id) {
    return this.executeStoredProcedure('SELECT', { PurchaseRFQID: id });
  }

  static async createPurchaseRFQ(data) {
    return this.executeStoredProcedure('INSERT', data);
  }

  static async updatePurchaseRFQ(id, data) {
    return this.executeStoredProcedure('UPDATE', { PurchaseRFQID: id, ...data });
  }

  static async deletePurchaseRFQ(id, deletedByID) {
    return this.executeStoredProcedure('DELETE', { PurchaseRFQID: id, DeletedByID: deletedByID });
  }
}

module.exports = PurchaseRFQModel;