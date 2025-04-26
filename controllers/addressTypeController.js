const addressTypeModel = require('../models/addressTypeModel');

class AddressTypeController {
  async getAllAddressTypes(req, res) {
    try {
      const pageNumber = parseInt(req.query.pageNumber) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null;
      const toDate = req.query.toDate ? new Date(req.query.toDate) : null;

      // Validate pagination parameters
      if (pageNumber < 1 || pageSize < 1) {
        return res.status(400).json({ error: 'Invalid pagination parameters' });
      }

      // Validate date parameters
      if ((fromDate && isNaN(fromDate.getTime())) || (toDate && isNaN(toDate.getTime()))) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const result = await addressTypeModel.getAllAddressTypes(pageNumber, pageSize, fromDate, toDate);

      if (result.result === 0) {
        return res.status(200).json({
          message: result.message,
          data: result.data,
          pagination: {
            totalRecords: result.totalRecords,
            pageNumber: result.pageNumber,
            pageSize: result.pageSize,
            totalPages: Math.ceil(result.totalRecords / result.pageSize)
          }
        });
      } else {
        return res.status(400).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async createAddressType(req, res) {
    try {
      const data = req.body;

      // Basic validation
      if (!data.AddressType) {
        return res.status(400).json({ error: 'Address type is required' });
      }

      const result = await addressTypeModel.createAddressType(data);

      if (result.result === 0) {
        return res.status(201).json({
          message: result.message,
          addressTypeID: result.addressTypeID,
        });
      } else {
        return res.status(400).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getAddressType(req, res) {
    try {
      const addressTypeID = parseInt(req.params.id);

      if (isNaN(addressTypeID)) {
        return res.status(400).json({ error: 'Invalid Address Type ID' });
      }

      const result = await addressTypeModel.getAddressType(addressTypeID);

      if (result.result === 0 && result.data) {
        return res.status(200).json(result.data);
      } else {
        return res.status(404).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async updateAddressType(req, res) {
    try {
      const addressTypeID = parseInt(req.params.id);
      const data = req.body;

      if (isNaN(addressTypeID)) {
        return res.status(400).json({ error: 'Invalid Address Type ID' });
      }

      const result = await addressTypeModel.updateAddressType(addressTypeID, data);

      if (result.result === 0) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(400).json({ error: result.message });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteAddressType(req, res) {
    try {
      const addressTypeID = parseInt(req.params.id);
      const { deletedByID } = req.body;

      if (isNaN(addressTypeID)) {
        return res.status(400).json({ error: 'Invalid Address Type ID' });
      }

      const result = await addressTypeModel.deleteAddressType(addressTypeID, deletedByID);

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

module.exports = new AddressTypeController();