const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

router.get('/all', cityController.getAllCities); // Get all cities with pagination
router.post('/', cityController.createCity);
router.get('/:id', cityController.getCity); // Get by ID
router.put('/:id', cityController.updateCity);
router.delete('/:id', cityController.deleteCity);

module.exports = router;