const companyModel = require('../models/companyModel');

class CompanyController {
  async getAllCompanies(req, res) {
    try {
      const pageNumber = parseInt(req.query.pageNumber) || 1;
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

      const result = await companyModel.getAllCompanies(pageNumber, pageSize, fromDate, toDate);
      
      if (result.result === 0) {
        return res.status(200).json({
          message: result.message,
          data: result.companies
        });
      } else {
        return res.status(400).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async createCompany(req, res) {
    try {
      const data = req.body;
      
      // Basic validation
      if (!data.companyName) {
        return res.status(400).json({ error: 'Company name is required' });
      }

      const result = await companyModel.createCompany(data);
      
      if (result.result === 0) {
        return res.status(201).json({
          message: result.message,
          companyID: result.companyID,
        });
      } else {
        return res.status(400).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getCompany(req, res) {
    try {
      const companyID = parseInt(req.params.id);
      
      if (isNaN(companyID)) {
        return res.status(400).json({ error: 'Invalid Company ID' });
      }

      const result = await companyModel.getCompany(companyID);
      
      if (result.result === 0 && result.data) {
        return res.status(200).json(result.data);
      } else {
        return res.status(404).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async updateCompany(req, res) {
    try {
      const companyID = parseInt(req.params.id);
      const data = req.body;
      
      if (isNaN(companyID)) {
        return res.status(400).json({ error: 'Invalid Company ID' });
      }

      const result = await companyModel.updateCompany(companyID, data);
      
      if (result.result === 0) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(400).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteCompany(req, res) {
    try {
      const companyID = parseInt(req.params.id);
      const { createdByID } = req.body;
      
      if (isNaN(companyID)) {
        return res.status(400).json({ error: 'Invalid Company ID' });
      }

      const result = await companyModel.deleteCompany(companyID, createdByID);
      
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

module.exports = new CompanyController();