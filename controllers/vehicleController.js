const vehicleModel = require('../models/vehicleModel');

class VehicleController {
  async getAllVehicles(req, res) {
    try {
      const pageNumber = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.limit) || 10;

      // Validate pagination parameters
      if (pageNumber < 1 || pageSize < 1) {
        return res.status(400).json({ error: 'Invalid page number or page size' });
      }

      const result = await vehicleModel.getAllVehicles(pageNumber, pageSize);

      if (result.result === 0) {
        return res.status(200).json({
          data: result.data,
          message: result.message,
          pagination: {
            page: pageNumber,
            limit: pageSize,
            total: result.data.length
          }
        });
      } else {
        return res.status(400).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async createVehicle(req, res) {
    try {
      const data = req.body;

      // Basic validation
      if (!data.truckNumberPlate && !data.vin) {
        return res.status(400).json({ error: 'TruckNumberPlate or VIN is required' });
      }

      const result = await vehicleModel.createVehicle(data);

      if (result.result === 0) {
        return res.status(201).json({
          message: result.message,
          vehicleID: result.vehicleID,
        });
      } else {
        return res.status(400).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getVehicle(req, res) {
    try {
      const vehicleID = parseInt(req.params.id);

      if (isNaN(vehicleID)) {
        return res.status(400).json({ error: 'Invalid Vehicle ID' });
      }

      const result = await vehicleModel.getVehicle(vehicleID);

      if (result.result === 0 && result.data) {
        return res.status(200).json(result.data);
      } else {
        return res.status(404).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async updateVehicle(req, res) {
    try {
      const vehicleID = parseInt(req.params.id);
      const data = req.body;

      if (isNaN(vehicleID)) {
        return res.status(400).json({ error: 'Invalid Vehicle ID' });
      }

      const result = await vehicleModel.updateVehicle(vehicleID, data);

      if (result.result === 0) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(400).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteVehicle(req, res) {
    try {
      const vehicleID = parseInt(req.params.id);
      const { deletedByID } = req.body;

      if (isNaN(vehicleID)) {
        return res.status(400).json({ error: 'Invalid Vehicle ID' });
      }

      const result = await vehicleModel.deleteVehicle(vehicleID, deletedByID);

      if (result.result === 0) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(400).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new VehicleController();