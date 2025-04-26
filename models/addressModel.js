const sql = require('mssql');
const poolPromise = require('../config/db.config');

class AddressModel {
  static async #executeStoredProcedure(action, addressData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), action);
      if (addressData.AddressID) request.input('AddressID', sql.Int, addressData.AddressID);
      if (addressData.AddressTitle) request.input('AddressTitle', sql.NVarChar(255), addressData.AddressTitle);
      if (addressData.AddressName) request.input('AddressName', sql.NVarChar(100), addressData.AddressName);
      if (addressData.AddressTypeID) request.input('AddressTypeID', sql.Int, addressData.AddressTypeID);
      if (addressData.AddressLine1) request.input('AddressLine1', sql.NVarChar(255), addressData.AddressLine1);
      if (addressData.AddressLine2) request.input('AddressLine2', sql.NVarChar(255), addressData.AddressLine2);
      if (addressData.City) request.input('City', sql.NVarChar(50), addressData.City);
      if (addressData.County) request.input('County', sql.NVarChar(50), addressData.County);
      if (addressData.State) request.input('State', sql.NVarChar(50), addressData.State);
      if (addressData.PostalCode) request.input('PostalCode', sql.NVarChar(50), addressData.PostalCode);
      if (addressData.Country) request.input('Country', sql.NVarChar(50), addressData.Country);
      if (addressData.PreferredBillingAddress !== undefined) request.input('PreferredBillingAddress', sql.Bit, addressData.PreferredBillingAddress);
      if (addressData.PreferredShippingAddress !== undefined) request.input('PreferredShippingAddress', sql.Bit, addressData.PreferredShippingAddress);
      if (addressData.Longitude) request.input('Longitude', sql.Decimal(9, 6), addressData.Longitude);
      if (addressData.Latitude) request.input('Latitude', sql.Decimal(9, 6), addressData.Latitude);
      if (addressData.Disabled !== undefined) request.input('Disabled', sql.Bit, addressData.Disabled);
      if (addressData.CreatedByID) request.input('CreatedByID', sql.Int, addressData.CreatedByID);

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageAddresses');

      return {
        success: result.output.Result === 1,
        message: result.output.Message,
        data: action === 'SELECT' ? result.recordset || [] : null,
        addressId: action === 'INSERT' ? result.recordset?.[0]?.AddressID || null : addressData.AddressID
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async createAddress(addressData) {
    // Validate required fields
    const requiredFields = ['AddressTitle', 'AddressLine1', 'City', 'Country', 'AddressTypeID'];
    const missingFields = requiredFields.filter(field => !addressData[field]);
    
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null
      };
    }
    
    return await this.#executeStoredProcedure('INSERT', addressData);
  }

  static async updateAddress(addressData) {
    return await this.#executeStoredProcedure('UPDATE', addressData);
  }

  static async deleteAddress(addressData) {
    return await this.#executeStoredProcedure('DELETE', addressData);
  }

  static async getAddress(addressData) {
    return await this.#executeStoredProcedure('SELECT', addressData);
  }

  static async getAllAddresses(pageNumber = 1, pageSize = 10, fromDate = null, toDate = null) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('PageNumber', sql.Int, pageNumber);
      request.input('PageSize', sql.Int, pageSize);
      request.input('FromDate', sql.DateTime, fromDate);
      request.input('ToDate', sql.DateTime, toDate);

      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('GetAllAddresses');

      return {
        success: result.output.Result === 1,
        message: result.output.Message,
        data: result.recordset || [],
        totalRecords: result.recordset ? result.recordset.length : 0,
        pageNumber: pageNumber,
        pageSize: pageSize
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

module.exports = AddressModel;