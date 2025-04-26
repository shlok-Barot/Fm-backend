const express = require('express');
const SalesRFQController = require('../controllers/salesRFQController');

const router = express.Router();

// CRUD Routes
router.get('/', SalesRFQController.getAllSalesRFQs);
router.get('/:id', SalesRFQController.getSalesRFQById);
router.post('/', SalesRFQController.createSalesRFQ);
router.put('/:id', SalesRFQController.updateSalesRFQ);
router.delete('/:id', SalesRFQController.deleteSalesRFQ);

module.exports = router;