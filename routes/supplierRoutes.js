const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// Get all suppliers with pagination and filtering
router.get('/', supplierController.getAllSuppliers);

// CRUD Routes
router.post('/', supplierController.createSupplier); // Create
router.get('/:id', supplierController.getSupplier); // Read
router.put('/:id', supplierController.updateSupplier); // Update
router.delete('/:id', supplierController.deleteSupplier); // Delete

module.exports = router;