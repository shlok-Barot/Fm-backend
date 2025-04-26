const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');

router.get('/all', currencyController.getAllCurrencies); // Get all currencies with pagination
router.post('/', currencyController.createCurrency);
router.get('/:id', currencyController.getCurrency); // Get by ID
router.put('/:id', currencyController.updateCurrency);
router.delete('/:id', currencyController.deleteCurrency);

module.exports = router;