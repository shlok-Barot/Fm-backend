const AddressModel = require('../models/addressModel');

class AddressController {
  static async createAddress(req, res) {
    try {
      const addressData = req.body;

      // Basic validation
      if (!addressData.AddressTitle || !addressData.AddressLine1 || !addressData.City || !addressData.Country || !addressData.AddressTypeID) {
        return res.status(400).json({ success: false, message: 'AddressTitle, AddressLine1, City, Country, and AddressTypeID are required' });
      }

      const result = await AddressModel.createAddress({
        ...addressData,
        CreatedByID: 1
      });

      if (result.success) {
        return res.status(201).json({
          success: true,
          message: result.message,
          addressId: result.addressId
        });
      }
      return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
      return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
  }

  static async updateAddress(req, res) {
    try {
      const { id } = req.params;
      const addressData = req.body;

      // Basic validation
      if (!id || isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Valid AddressID is required' });
      }

      const result = await AddressModel.updateAddress({
        AddressID: parseInt(id),
        ...addressData,
        PreferredBillingAddress: addressData.PreferredBillingAddress || false,
        PreferredShippingAddress: addressData.PreferredShippingAddress || false
      });

      if (result.success) {
        return res.status(200).json({ success: true, message: result.message });
      }
      return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
      return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
  }

  static async getAllAddresses(req, res) {
    try {
      const { pageNumber = 1, pageSize = 10, fromDate, toDate } = req.query;
      const result = await AddressModel.getAllAddresses(
        parseInt(pageNumber),
        parseInt(pageSize),
        fromDate,
        toDate
      );
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data,
          totalRecords: result.totalRecords,
          pageNumber: result.pageNumber,
          pageSize: result.pageSize
        });
      }
      return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
      return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
  }

  static async deleteAddress(req, res) {
    try {
      const { id } = req.params;

      // Basic validation
      if (!id || isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Valid AddressID is required' });
      }

      const result = await AddressModel.deleteAddress({
        AddressID: parseInt(id),
        DeletedByID: 1
      });

      if (result.success) {
        return res.status(200).json({ success: true, message: result.message });
      }
      return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
      return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
  }

  static async getAddress(req, res) {
    try {
      const { id } = req.params;

      // Basic validation
      if (!id || isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Valid AddressID is required' });
      }

      const result = await AddressModel.getAddress({
        AddressID: parseInt(id)
      });

      if (result.success && result.data.length > 0) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data[0]
        });
      }
      return res.status(404).json({ success: false, message: 'Address not found' });
    } catch (error) {
      return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
  }
}

module.exports = AddressController;