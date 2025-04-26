const PurchaseRFQModel = require('../models/purchaseRFQModel');

class PurchaseRFQController {
  static async getAllPurchaseRFQs(req, res) {
    try {
      const result = await PurchaseRFQModel.getAllPurchaseRFQs();
      if (result.output.Result !== 0) {
        return res.status(400).json({ message: result.output.Message });
      }
      res.json({
        message: result.output.Message,
        data: result.recordset || []
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getPurchaseRFQById(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid PurchaseRFQID' });
      }
      const result = await PurchaseRFQModel.getPurchaseRFQById(id);
      if (result.output.Result !== 0) {
        return res.status(400).json({ message: result.output.Message });
      }
      if (!result.recordset || result.recordset.length === 0) {
        return res.status(404).json({ message: 'Purchase RFQ not found' });
      }
      res.json({
        message: result.output.Message,
        data: result.recordset[0]
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createPurchaseRFQ(req, res) {
    try {
      const data = req.body;
      // Basic validation
      if (!data.SalesRFQID || !data.CreatedByID) {
        return res.status(400).json({ message: 'SalesRFQID and CreatedByID are required' });
      }
      const result = await PurchaseRFQModel.createPurchaseRFQ(data);
      if (result.output.Result !== 0) {
        return res.status(400).json({ message: result.output.Message });
      }
      res.status(201).json({
        message: result.output.Message,
        PurchaseRFQID: result.output.NewPurchaseRFQID
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async updatePurchaseRFQ(req, res) {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid PurchaseRFQID' });
      }
      if (!data.SalesRFQID || !data.CreatedByID) {
        return res.status(400).json({ message: 'SalesRFQID and CreatedByID are required' });
      }
      const result = await PurchaseRFQModel.updatePurchaseRFQ(id, data);
      if (result.output.Result !== 0) {
        return res.status(400).json({ message: result.output.Message });
      }
      res.json({ message: result.output.Message });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async deletePurchaseRFQ(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { deletedByID } = req.body;
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid PurchaseRFQID' });
      }
      if (!deletedByID) {
        return res.status(400).json({ message: 'DeletedByID is required' });
      }
      const result = await PurchaseRFQModel.deletePurchaseRFQ(id, deletedByID);
      if (result.output.Result !== 0) {
        return res.status(400).json({ message: result.output.Message });
      }
      res.json({ message: result.output.Message });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = PurchaseRFQController;