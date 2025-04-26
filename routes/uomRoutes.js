const express = require('express');
const router = express.Router();
const UOMController = require('../controllers/uomController');

// CRUD Routes
router.post('/', UOMController.createUOM); // Create a new UOM
router.get('/', UOMController.getAllUOMs); // Get paginated UOMs with date filtering
router.get('/:uomID?', UOMController.getUOM); // Get one or all UOMs
router.put('/:uomID', UOMController.updateUOM); // Update a UOM
router.delete('/:uomID', UOMController.deleteUOM); // Delete a UOM

module.exports = router;