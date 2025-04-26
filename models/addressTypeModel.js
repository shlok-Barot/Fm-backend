const sql = require('mssql');
const poolPromise  = require('../config/db.config');

class AddressTypeModel {
  async getAllAddressTypes(pageNumber = 1, pageSize = 10, fromDate = null, toDate = null) {
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

      const result = await request.execute('GetAllAddressTypes');

      return {
        result: result.output.Result,
        message: result.output.Message,
        data: result.recordset || [],
        totalRecords: result.recordset ? result.recordset.length : 0,
        pageNumber: pageNumber,
        pageSize: pageSize
      };
    } catch (err) {
      throw new Error(`Error fetching address types: ${err.message}`);
    }
  }
  async createAddressType(data) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), 'INSERT');
      request.input('AddressType', sql.NVarChar(50), data.AddressType);
      request.input('CreatedByID', sql.Int, data.createdByID || null);

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));
      request.input('AddressTypeID', sql.Int, null);  // Change to input parameter since SP expects it as input

      const result = await request.execute('ManageAddressType');

      return {
        result: result.output.Result,
        message: result.output.Message,
        addressTypeID: result.output.AddressTypeID,
      };
    } catch (err) {
      throw new Error(`Error creating address type: ${err.message}`);
    }
  }

  async getAddressType(addressTypeID) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'SELECT');
      request.input('AddressTypeID', sql.Int, addressTypeID);
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageAddressType');

      return {
        success: result.output.Result === 1,
        message: result.output.Message,
        data: result.recordset && result.recordset.length > 0 ? result.recordset[0] : null
      };
    } catch (err) {
      throw new Error(`Error fetching address type: ${err.message}`);
    }
  }

  async updateAddressType(addressTypeID, data) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'UPDATE');
      request.input('AddressTypeID', sql.Int, addressTypeID);
      request.input('AddressType', sql.NVarChar(50), data.AddressType || null);
      request.input('CreatedByID', sql.Int, data.createdByID || null);

      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageAddressType');

      return {
        result: result.output.Result,
        message: result.output.Message,
      };
    } catch (err) {
      throw new Error(`Error updating address type: ${err.message}`);
    }
  }

  async deleteAddressType(addressTypeID, deletedByID) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'DELETE');
      request.input('AddressTypeID', sql.Int, addressTypeID);
      

      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageAddressType');

      return {
        result: result.output.Result,
        message: result.output.Message,
      };
    } catch (err) {
      throw new Error(`Error deleting address type: ${err.message}`);
    }
  }
}

module.exports = new AddressTypeModel();