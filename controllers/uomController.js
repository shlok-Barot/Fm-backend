const UOMModel = require('../models/uomModel');

class UOMController {
  // Create a new UOM
  static async createUOM(req, res) {
    console.log('POST /api/uom - Request body:', req.body); // Debug log
    try {
      const { uom, createdByID } = req.body;

      // Validate inputs
      if (!uom || uom.trim() === '' || !Number.isInteger(createdByID) || createdByID <= 0) {
        return res.status(400).json({
          success: false,
          message: 'UOM (non-empty string) and CreatedByID (positive integer) are required',
        });
      }

      const result = await UOMModel.createUOM({ uom, createdByID });
      if (result.result === 0) {
        return res.status(201).json({
          success: true,
          message: result.message,
          uomID: result.uomID,
        });
      }
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    } catch (err) {
      console.error('Error in createUOM:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
      });
    }
  }

  // Get all UOMs with pagination and date filtering
  static async getAllUOMs(req, res) {
    console.log('GET /api/uom - Query:', req.query); // Debug log
    try {
      const pageNumber = parseInt(req.query.pageNumber) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null;
      const toDate = req.query.toDate ? new Date(req.query.toDate) : null;

      // Validate inputs
      if (pageNumber < 1 || pageSize < 1) {
        return res.status(400).json({
          success: false,
          message: 'PageNumber and PageSize must be positive integers',
        });
      }

      const result = await UOMModel.getAllUOMs({ pageNumber, pageSize, fromDate, toDate });
      if (result.result === 0) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      }
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    } catch (err) {
      console.error('Error in getAllUOMs:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
      });
    }
  }

  // Get UOM by ID
  static async getUOM(req, res) {
    console.log('GET /api/uom/:id - Params:', req.params); // Debug log
    try {
      const { uomID } = req.params;
      const result = await UOMModel.getUOM(uomID ? parseInt(uomID) : null);
      if (result.result === 0) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      }
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    } catch (err) {
      console.error('Error in getUOM:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
      });
    }
  }

  // Update a UOM
  static async updateUOM(req, res) {
    console.log('PUT /api/uom - Params:', req.params, 'Body:', req.body); // Debug log
    try {
      const { uomID } = req.params;
      const { uom, createdByID } = req.body;

      // Validate inputs
      if (!uomID || isNaN(parseInt(uomID)) || !uom || uom.trim() === '' || !Number.isInteger(createdByID) || createdByID <= 0) {
        return res.status(400).json({
          success: false,
          message: 'UOMID (integer), UOM (non-empty string), and CreatedByID (positive integer) are required',
        });
      }

      const result = await UOMModel.updateUOM({ uomID: parseInt(uomID), uom, createdByID });
      if (result.result === 0) {
        return res.status(200).json({
          success: true,
          message: result.message,
        });
      }
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    } catch (err) {
      console.error('Error in updateUOM:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
      });
    }
  }

  // Delete a UOM
  static async deleteUOM(req, res) {
    console.log('DELETE /api/uom - Params:', req.params, 'Body:', req.body); // Debug log
    try {
      const { uomID } = req.params;
      const { deletedByID } = req.body;

      // Validate inputs
      if (!uomID || isNaN(parseInt(uomID)) || !Number.isInteger(deletedByID) || deletedByID <= 0) {
        return res.status(400).json({
          success: false,
          message: 'UOMID (integer) and DeletedByID (positive integer) are required',
        });
      }

      const result = await UOMModel.deleteUOM({ uomID: parseInt(uomID), deletedByID });
      if (result.result === 0) {
        return res.status(200).json({
          success: true,
          message: result.message,
        });
      }
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    } catch (err) {
      console.error('Error in deleteUOM:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
      });
    }
  }
}

module.exports = UOMController;