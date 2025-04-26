const express = require('express');
const PurchaseRFQController = require('../controllers/purchaseRFQController');

const router = express.Router();

// CRUD Routes
router.get('/', PurchaseRFQController.getAllPurchaseRFQs);
router.get('/:id', PurchaseRFQController.getPurchaseRFQById);
router.post('/', PurchaseRFQController.createPurchaseRFQ);
router.put('/:id', PurchaseRFQController.updatePurchaseRFQ);
router.delete('/:id', PurchaseRFQController.deletePurchaseRFQ);

module.exports = router;