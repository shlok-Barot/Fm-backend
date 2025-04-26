const supplierModel = require('../models/supplierModel');

class SupplierController {
  async getAllSuppliers(req, res) {
    try {
      const pageNumber = parseInt(req.query.pagenumber) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null;
      const toDate = req.query.toDate ? new Date(req.query.toDate) : null;

      // Validate pagination parameters
      if (pageNumber < 1 || pageSize < 1) {
        return res.status(400).json({ error: 'Invalid page number or page size' });
      }

      // Validate date parameters if provided
      if ((fromDate && isNaN(fromDate.getTime())) || (toDate && isNaN(toDate.getTime()))) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const result = await supplierModel.getAllSuppliers(pageNumber, pageSize, fromDate, toDate);

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

  async createSupplier(req, res) {
    try {
      const data = req.body;

      // Basic validation
      if (!data.supplierName) {
        return res.status(400).json({ error: 'Supplier name is required' });
      }

      const result = await supplierModel.createSupplier(data);

      if (result.result === 0) {
        return res.status(201).json({
          message: result.message,
          supplierID: result.supplierID,
        });
      } else {
        return res.status(400).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getSupplier(req, res) {
    try {
      const supplierID = parseInt(req.params.id);

      if (isNaN(supplierID)) {
        return res.status(400).json({ error: 'Invalid Supplier ID' });
      }

      const result = await supplierModel.getSupplier(supplierID);

      if (result.result === 0 && result.data) {
        return res.status(200).json(result.data);
      } else {
        return res.status(404).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async updateSupplier(req, res) {
    try {
      const supplierID = parseInt(req.params.id);
      const data = req.body;

      if (isNaN(supplierID)) {
        return res.status(400).json({ error: 'Invalid Supplier ID' });
      }

      const result = await supplierModel.updateSupplier(supplierID, data);

      if (result.result === 0) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(400).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteSupplier(req, res) {
    try {
      const supplierID = parseInt(req.params.id);
      const { userID } = req.body;

      if (isNaN(supplierID)) {
        return res.status(400).json({ error: 'Invalid Supplier ID' });
      }

      const result = await supplierModel.deleteSupplier(supplierID, userID);

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

module.exports = new SupplierController();