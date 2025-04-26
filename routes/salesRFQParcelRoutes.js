const express = require('express');
const router = express.Router();
const SalesRFQParcelController1 = require('../controllers/salesRFQParcelController');

// CRUD Routes
router.get('/', SalesRFQParcelController1.getAllSalesRFQParcels);
router.get('/:id', SalesRFQParcelController1.getSalesRFQParcelById);
router.post('/', SalesRFQParcelController1.createSalesRFQParcel);
router.put('/:id', SalesRFQParcelController1.updateSalesRFQParcel);
router.delete('/:id', SalesRFQParcelController1.deleteSalesRFQParcel);

module.exports = router;