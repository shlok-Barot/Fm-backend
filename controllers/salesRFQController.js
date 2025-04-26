const SalesRFQModel = require('../models/salesRFQModel');

class SalesRFQController {
  static async getAllSalesRFQs(req, res) {
    try {
      const pageNumber = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null;
      const toDate = req.query.toDate ? new Date(req.query.toDate) : null;
      const dateField = req.query.dateField || 'CreatedDateTime';

      const result = await SalesRFQModel.getAllSalesRFQs(pageNumber, pageSize, fromDate, toDate, dateField);
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getSalesRFQById(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid SalesRFQID' });
      }
      const result = await SalesRFQModel.getSalesRFQById(id);
      if (result.output.Result !== 0) {
        return res.status(400).json({ message: result.output.Message });
      }
      if (!result.recordset || result.recordset.length === 0) {
        return res.status(404).json({ message: 'Sales RFQ not found' });
      }
      res.json({
        message: result.output.Message,
        data: result.recordset[0] // Return the single record
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createSalesRFQ(req, res) {
    try {
      const data = req.body;
      // Basic validation
      if (!data.CompanyID || !data.CustomerID) {
        return res.status(400).json({ message: 'CompanyID and CustomerID are required' });
      }
      const result = await SalesRFQModel.createSalesRFQ(data);
      if (result.output.Result !== 0) {
        return res.status(400).json({ message: result.output.Message });
      }
      res.status(201).json({
        message: result.output.Message,
        SalesRFQID: result.output.NewSalesRFQID
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async updateSalesRFQ(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid SalesRFQID' });
      }
      const data = req.body;
      const result = await SalesRFQModel.updateSalesRFQ(id, data);
      if (result.output.Result !== 0) {
        return res.status(400).json({ message: result.output.Message });
      }
      res.json({ message: result.output.Message });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async deleteSalesRFQ(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid SalesRFQID' });
      }
      const result = await SalesRFQModel.deleteSalesRFQ(id);
      if (result.output.Result !== 0) {
        return res.status(400).json({ message: result.output.Message });
      }
      res.json({ message: result.output.Message });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = SalesRFQController;