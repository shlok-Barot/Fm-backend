// controllers/customerController.js
const CustomerModel = require('../models/customerModel');

class CustomerController {
  async getCustomers(req, res) {
    try {
      const customerId = req.params.id ? parseInt(req.params.id) : null;
      const result = await CustomerModel.getCustomers(customerId);
      
      if (result.result !== 0) {
        return res.status(400).json({ message: result.message });
      }
      
      res.json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error: ' + error.message 
      });
    }
  }

  async createCustomer(req, res) {
    try {
      const customerData = {
        CustomerName: req.body.customerName,
        CompanyID: req.body.companyId,
        ImportCode: req.body.importCode,
        BillingCurrencyID: req.body.billingCurrencyId,
        Website: req.body.website,
        CustomerNotes: req.body.customerNotes,
        IsInQuickBooks: req.body.isInQuickBooks,
        QuickBookAccountID: req.body.quickBookAccountId,
        CustomerAddressID: req.body.customerAddressId,
        CreatedByID: req.body.createdById
      };

      const result = await CustomerModel.createCustomer(customerData);
      
      if (result.result !== 0) {
        return res.status(400).json({ message: result.message });
      }
      
      res.status(201).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error: ' + error.message 
      });
    }
  }

  async updateCustomer(req, res) {
    try {
      const customerId = parseInt(req.params.id);
      const customerData = {
        CustomerName: req.body.customerName,
        CompanyID: req.body.companyId,
        ImportCode: req.body.importCode,
        BillingCurrencyID: req.body.billingCurrencyId,
        Website: req.body.website,
        CustomerNotes: req.body.customerNotes,
        IsInQuickBooks: req.body.isInQuickBooks,
        QuickBookAccountID: req.body.quickBookAccountId,
        CustomerAddressID: req.body.customerAddressId,
        CreatedByID: req.body.createdById
      };

      const result = await CustomerModel.updateCustomer(customerId, customerData);
      
      if (result.result !== 0) {
        return res.status(400).json({ message: result.message });
      }
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error: ' + error.message 
      });
    }
  }

  async deleteCustomer(req, res) {
    try {
      const customerId = parseInt(req.params.id);
      const deletedById = req.body.deletedById;

      const result = await CustomerModel.deleteCustomer(customerId, deletedById);
      
      if (result.result !== 0) {
        return res.status(400).json({ message: result.message });
      }
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error: ' + error.message 
      });
    }
  }
}

module.exports = new CustomerController();