const SalesRFQParcelModel = require('../models/salesRFQParcelModel');

class SalesRFQParcelController {
  static async getAllSalesRFQParcels(req, res) {
    try {
      const result = await SalesRFQParcelModel.getAllSalesRFQParcels();
      res.json({
        message: 'Records retrieved successfully',
        data: result.recordset || []
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getSalesRFQParcelById(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid SalesRFQParcelID' });
      }
      const result = await SalesRFQParcelModel.getSalesRFQParcelById(id);
      if (!result.recordset || result.recordset.length === 0) {
        return res.status(404).json({ message: 'Sales RFQ Parcel not found' });
      }
      res.json({
        message: 'Record retrieved successfully',
        data: result.recordset[0]
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createSalesRFQParcel(req, res) {
    try {
      const data = req.body;
      // Basic validation
      if (!data.SalesRFQID || !data.ItemID || !data.ItemQuantity || !data.UOMID || !data.CreatedByID) {
        return res.status(400).json({ message: 'SalesRFQID, ItemID, ItemQuantity, UOMID, and CreatedByID are required' });
      }
      const result = await SalesRFQParcelModel.createSalesRFQParcel(data);
      res.status(201).json({
        message: 'Record created successfully',
        SalesRFQParcelID: result.output.NewSalesRFQParcelID
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async updateSalesRFQParcel(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid SalesRFQParcelID' });
      }
      const data = req.body;
      const result = await SalesRFQParcelModel.updateSalesRFQParcel(id, data);
      if (!result.recordset && !result.output.NewSalesRFQParcelID) {
        return res.status(400).json({ message: 'No records were updated' });
      }
      res.json({ message: 'Record updated successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async deleteSalesRFQParcel(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { deletedByID } = req.body;
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid SalesRFQParcelID' });
      }
      if (!deletedByID) {
        return res.status(400).json({ message: 'DeletedByID is required' });
      }
      const result = await SalesRFQParcelModel.deleteSalesRFQParcel(id, deletedByID);
      if (!result.recordset && !result.output.NewSalesRFQParcelID) {
        return res.status(400).json({ message: 'No records were deleted' });
      }
      res.json({ message: 'Record deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = SalesRFQParcelController;