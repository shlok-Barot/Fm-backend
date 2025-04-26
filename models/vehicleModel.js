const sql = require('mssql');
const poolPromise  = require('../config/db.config');

class VehicleModel {
  async getAllVehicles(pageNumber = 1, pageSize = 10) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('PageNumber', sql.Int, pageNumber);
      request.input('PageSize', sql.Int, pageSize);
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('GetAllVehicles');

      return {
        result: result.output.Result,
        message: result.output.Message,
        data: result.recordset || [],
      };
    } catch (err) {
      throw new Error(`Error fetching vehicles: ${err.message}`);
    }
  }

  async createVehicle(data) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), 'INSERT');
      request.input('TruckNumberPlate', sql.NVarChar(50), data.truckNumberPlate || null);
      request.input('VIN', sql.NVarChar(50), data.vin || null);
      request.input('CompanyID', sql.Int, data.companyID || null);
      request.input('MaxWeight', sql.Decimal(14, 4), data.maxWeight || null);
      request.input('Length', sql.Decimal(14, 4), data.length || null);
      request.input('Width', sql.Decimal(14, 4), data.width || null);
      request.input('Height', sql.Decimal(14, 4), data.height || null);
      request.input('VehicleTypeID', sql.Int, data.vehicleTypeID || null);
      request.input('NumberOfWheels', sql.Int, data.numberOfWheels || null);
      request.input('NumberOfAxels', sql.Int, data.numberOfAxels || null);
      request.input('CreatedByID', sql.Int, data.createdByID || null);

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageVehicle');

      return {
        result: result.output.Result,
        message: result.output.Message,
        vehicleID: result.recordset && result.recordset.length > 0 ? result.recordset[0].VehicleID : null,
      };
    } catch (err) {
      throw new Error(`Error creating vehicle: ${err.message}`);
    }
  }

  async getVehicle(vehicleID) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'SELECT');
      request.input('VehicleID', sql.Int, vehicleID);
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageVehicle');

      return {
        result: result.output.Result,
        message: result.output.Message,
        data: result.recordset && result.recordset.length > 0 ? result.recordset[0] : null,
      };
    } catch (err) {
      throw new Error(`Error fetching vehicle: ${err.message}`);
    }
  }

  async updateVehicle(vehicleID, data) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'UPDATE');
      request.input('VehicleID', sql.Int, vehicleID);
      request.input('TruckNumberPlate', sql.NVarChar(50), data.truckNumberPlate || null);
      request.input('VIN', sql.NVarChar(50), data.vin || null);
      request.input('CompanyID', sql.Int, data.companyID || null);
      request.input('MaxWeight', sql.Decimal(14, 4), data.maxWeight || null);
      request.input('Length', sql.Decimal(14, 4), data.length || null);
      request.input('Width', sql.Decimal(14, 4), data.width || null);
      request.input('Height', sql.Decimal(14, 4), data.height || null);
      request.input('VehicleTypeID', sql.Int, data.vehicleTypeID || null);
      request.input('NumberOfWheels', sql.Int, data.numberOfWheels || null);
      request.input('NumberOfAxels', sql.Int, data.numberOfAxels || null);
      request.input('CreatedByID', sql.Int, data.createdByID || null);

      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageVehicle');

      return {
        result: result.output.Result,
        message: result.output.Message,
      };
    } catch (err) {
      throw new Error(`Error updating vehicle: ${err.message}`);
    }
  }

  async deleteVehicle(vehicleID, deletedByID) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('Action', sql.NVarChar(10), 'DELETE');
      request.input('VehicleID', sql.Int, vehicleID);
      request.input('DeletedByID', sql.Int, deletedByID || null);

      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('ManageVehicle');

      return {
        result: result.output.Result,
        message: result.output.Message,
      };
    } catch (err) {
      throw new Error(`Error deleting vehicle: ${err.message}`);
    }
  }
}

module.exports = new VehicleModel();