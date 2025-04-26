const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');

// Get all warehouses with pagination and date filtering
router.get('/', warehouseController.getAllWarehouses);

// CRUD Routes
router.post('/', warehouseController.createWarehouse); // Create
router.get('/:id', warehouseController.getWarehouse); // Read
router.put('/:id', warehouseController.updateWarehouse); // Update
router.delete('/:id', warehouseController.deleteWarehouse); // Delete

module.exports = router;