const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/addressController');

router.get('/', AddressController.getAllAddresses);

// CRUD Routes
router.post('/', AddressController.createAddress); // Create a new address
router.put('/:id', AddressController.updateAddress); // Update an existing address
router.delete('/:id', AddressController.deleteAddress); // Delete an address
router.get('/:id', AddressController.getAddress); // Get an address by ID

module.exports = router;