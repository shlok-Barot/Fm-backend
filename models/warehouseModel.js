const sql = require('mssql');
const poolPromise = require('../config/db.config');

class WarehouseModel {
  async getAllWarehouses(pageNumber = 1, pageSize = 10, fromDate = null, toDate = null) {
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

      const result = await request.execute('GetAllWarehouses');

      return {
        result: result.output.Result,
        message: result.output.Message,
        data: result.recordset || [],
      };
    } catch (err) {
      throw new Error(`Error fetching warehouses: ${err.message}`);
    }
  }
  async createWarehouse(data) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), 'INSERT');
      request.input('WarehouseName', sql.NVarChar(100), data.WarehouseName);
      request.input('WarehouseAddressID', sql.Int, data.warehouseAddressID || null);
      request.input('CreatedByID', sql.Int, data.createdByID || null);

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageWarehouse');

      return {
        result: result.output.Result,
        message: result.output.Message,
        warehouseID: result.recordset && result.recordset.length > 0 ? result.recordset[0].WarehouseID : null,
      };
    } catch (err) {
      throw new Error(`Error creating warehouse: ${err.message}`);
    }
  }

  async getWarehouse(warehouseID) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'SELECT');
      request.input('WarehouseID', sql.Int, warehouseID);
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageWarehouse');

      return {
        result: result.output.Result,
        message: result.output.Message,
        data: result.recordset && result.recordset.length > 0 ? result.recordset[0] : null,
      };
    } catch (err) {
      throw new Error(`Error fetching warehouse: ${err.message}`);
    }
  }

  async updateWarehouse(warehouseID, data) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'UPDATE');
      request.input('WarehouseID', sql.Int, warehouseID);
      request.input('WarehouseName', sql.NVarChar(100), data.WarehouseName || null);
      request.input('WarehouseAddressID', sql.Int, data.warehouseAddressID || null);
      request.input('CreatedByID', sql.Int, data.createdByID || null);

      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageWarehouse');

      return {
        result: result.output.Result,
        message: result.output.Message,
      };
    } catch (err) {
      throw new Error(`Error updating warehouse: ${err.message}`);
    }
  }

  async deleteWarehouse(warehouseID, deletedByID) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'DELETE');
      request.input('WarehouseID', sql.Int, warehouseID);
      request.input('DeletedByID', sql.Int, deletedByID || null);

      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageWarehouse');

      return {
        result: result.output.Result,
        message: result.output.Message,
      };
    } catch (err) {
      throw new Error(`Error deleting warehouse: ${err.message}`);
    }
  }
}

module.exports = new WarehouseModel();