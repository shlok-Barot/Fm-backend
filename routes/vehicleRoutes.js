const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// CRUD Routes
router.get('/', vehicleController.getAllVehicles); // Get all vehicles with pagination
router.post('/', vehicleController.createVehicle); // Create
router.get('/:id', vehicleController.getVehicle); // Read
router.put('/:id', vehicleController.updateVehicle); // Update
router.delete('/:id', vehicleController.deleteVehicle); // Delete

module.exports = router;