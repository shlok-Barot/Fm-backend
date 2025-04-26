const express = require('express');
const SalesRFQParcelController = require('../controllers/salesRFQParcelController');

const router = express.Router();

// CRUD Routes
router.get('/', SalesRFQParcelController.getAllSalesRFQParcels);
router.get('/:id', SalesRFQParcelController.getSalesRFQParcelById);
router.post('/', SalesRFQParcelController.createSalesRFQParcel);
router.put('/:id', SalesRFQParcelController.updateSalesRFQParcel);
router.delete('/:id', SalesRFQParcelController.deleteSalesRFQParcel);

module.exports = router;