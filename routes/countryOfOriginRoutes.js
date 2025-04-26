const express = require('express');
const router = express.Router();
const countryOfOriginController = require('../controllers/countryOfOriginController');

router.post('/', countryOfOriginController.createCountryOfOrigin);
router.get('/', countryOfOriginController.getAllCountriesOfOrigin); // List all
router.get('/:id', countryOfOriginController.getCountryOfOrigin); // Get by ID
router.put('/:id', countryOfOriginController.updateCountryOfOrigin);
router.delete('/:id', countryOfOriginController.deleteCountryOfOrigin);

module.exports = router;