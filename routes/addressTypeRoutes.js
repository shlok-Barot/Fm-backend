const express = require('express');
const router = express.Router();
const addressTypeController = require('../controllers/addressTypeController');

// CRUD Routes
router.get('/', addressTypeController.getAllAddressTypes); // Get all with pagination
router.post('/', addressTypeController.createAddressType); // Create
router.get('/:id', addressTypeController.getAddressType); // Read
router.put('/:id', addressTypeController.updateAddressType); // Update
router.delete('/:id', addressTypeController.deleteAddressType); // Delete

module.exports = router;