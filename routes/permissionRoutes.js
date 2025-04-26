// routes/permissionRoutes.js
const express = require('express');
const PermissionController = require('../controllers/permissionController');

const router = express.Router();

// Get all permissions with pagination
router.get('/', PermissionController.getAllPermissions);

// CRUD operations
router.post('/', PermissionController.createPermission);
router.put('/:PermissionID', PermissionController.updatePermission);
router.delete('/:PermissionID', PermissionController.deletePermission);
router.get('/:PermissionID', PermissionController.getPermission);

module.exports = router;