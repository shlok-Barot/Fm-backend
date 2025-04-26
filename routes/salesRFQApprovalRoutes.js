const express = require('express');
const router = express.Router();
const SalesRFQApprovalController = require('../controllers/salesRFQApprovalController');

// Get all Sales RFQ Approvals
router.get('/', SalesRFQApprovalController.getAllApprovals);

// Get a specific Sales RFQ Approval by ID
router.get('/:id', SalesRFQApprovalController.getApprovalById);

// Create a new Sales RFQ Approval
router.post('/', SalesRFQApprovalController.createApproval);

// Update a Sales RFQ Approval
router.put('/:id', SalesRFQApprovalController.updateApproval);

// Delete a Sales RFQ Approval (soft delete)
router.delete('/:id', SalesRFQApprovalController.deleteApproval);

module.exports = router;