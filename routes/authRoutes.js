const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/admin/signup', AuthController.adminSignup);
router.post('/login', AuthController.login);
router.post('/person', authMiddleware, AuthController.createPerson);
router.get('/verify', AuthController.verifyToken);

module.exports = router;