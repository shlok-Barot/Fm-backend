const warehouseModel = require('../models/warehouseModel');

class WarehouseController {
  async getAllWarehouses(req, res) {
    try {
      const pageNumber = parseInt(req.query.pageNumber) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null;
      const toDate = req.query.toDate ? new Date(req.query.toDate) : null;

      // Validate pagination parameters
      if (pageNumber < 1 || pageSize < 1) {
        return res.status(400).json({ error: 'Invalid pagination parameters' });
      }

      // Validate date parameters if provided
      if ((fromDate && isNaN(fromDate.getTime())) || (toDate && isNaN(toDate.getTime()))) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const result = await warehouseModel.getAllWarehouses(pageNumber, pageSize, fromDate, toDate);

      if (result.result === 0) {
        return res.status(200).json({
          data: result.data,
          message: result.message,
          pagination: {
            page: pageNumber,
            limit: pageSize,
            total: result.data.length // Note: Consider adding total count from SP if needed
          }
        });
      } else {
        return res.status(400).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async createWarehouse(req, res) {
    try {
      const data = req.body;

      // Basic validation
      if (!data.WarehouseName) {
        return res.status(400).json({ error: 'Warehouse name is required' });
      }

      const result = await warehouseModel.createWarehouse(data);

      if (result.result === 0) {
        return res.status(201).json({
          message: result.message,
          warehouseID: result.warehouseID,
        });
      } else {
        return res.status(400).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getWarehouse(req, res) {
    try {
      const warehouseID = parseInt(req.params.id);

      if (isNaN(warehouseID)) {
        return res.status(400).json({ error: 'Invalid Warehouse ID' });
      }

      const result = await warehouseModel.getWarehouse(warehouseID);

      if (result.result === 0 && result.data) {
        return res.status(200).json(result.data);
      } else {
        return res.status(404).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async updateWarehouse(req, res) {
    try {
      const warehouseID = parseInt(req.params.id);
      const data = req.body;

      if (isNaN(warehouseID)) {
        return res.status(400).json({ error: 'Invalid Warehouse ID' });
      }

      const result = await warehouseModel.updateWarehouse(warehouseID, data);

      if (result.result === 0) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(400).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteWarehouse(req, res) {
    try {
      const warehouseID = parseInt(req.params.id);
      const { deletedByID } = req.body;

      if (isNaN(warehouseID)) {
        return res.status(400).json({ error: 'Invalid Warehouse ID' });
      }

      const result = await warehouseModel.deleteWarehouse(warehouseID, deletedByID);

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

module.exports = new WarehouseController();