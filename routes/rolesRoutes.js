const express = require('express');
const RolesController = require('../controllers/rolesController');

const router = express.Router();

// CRUD Routes
router.get('/', RolesController.getAllRoles);
router.get('/:id', RolesController.getRoleById);
router.post('/', RolesController.createRole);
router.put('/:id', RolesController.updateRole);
router.delete('/:id', RolesController.deleteRole);

module.exports = router;