const sql = require('mssql');
const poolPromise  = require('../config/db.config');

class UOMModel {
  // Get all UOMs with pagination and date filtering
  static async getAllUOMs({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('PageNumber', sql.Int, pageNumber);
      request.input('PageSize', sql.Int, pageSize);
      request.input('FromDate', sql.DateTime, fromDate);
      request.input('ToDate', sql.DateTime, toDate);
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('GetAllUOMs');
      return {
        result: result.output.Result,
        message: result.output.Message,
        data: result.recordset || [],
      };
    } catch (err) {
      throw new Error(`Error retrieving UOMs: ${err.message}`);
    }
  }

  // Create a new UOM
  static async createUOM({ uom, createdByID }) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'INSERT');
      request.input('UOM', sql.NVarChar(20), uom);
      request.input('CreatedByID', sql.Int, createdByID);
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageUOM');
      return {
        result: result.output.Result,
        message: result.output.Message,
        uomID: result.output.UOMID || (result.recordset && result.recordset[0]?.UOMID),
      };
    } catch (err) {
      throw new Error(`Error creating UOM: ${err.message}`);
    }
  }

  // Get UOM(s)
  static async getUOM(uomID = null) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'SELECT');
      request.input('UOMID', sql.Int, uomID);
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageUOM');
      return {
        result: result.output.Result,
        message: result.output.Message,
        data: result.recordset || [],
      };
    } catch (err) {
      throw new Error(`Error retrieving UOM: ${err.message}`);
    }
  }

  // Update a UOM
  static async updateUOM({ uomID, uom, createdByID }) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'UPDATE');
      request.input('UOMID', sql.Int, uomID);
      request.input('UOM', sql.NVarChar(20), uom);
      request.input('CreatedByID', sql.Int, createdByID);
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageUOM');
      return {
        result: result.output.Result,
        message: result.output.Message,
      };
    } catch (err) {
      throw new Error(`Error updating UOM: ${err.message}`);
    }
  }

  // Delete a UOM (soft delete)
  static async deleteUOM({ uomID, deletedByID }) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'DELETE');
      request.input('UOMID', sql.Int, uomID);
      request.input('DeletedByID', sql.Int, deletedByID);
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageUOM');
      return {
        result: result.output.Result,
        message: result.output.Message,
      };
    } catch (err) {
      throw new Error(`Error deleting UOM: ${err.message}`);
    }
  }
}

module.exports = UOMModel;