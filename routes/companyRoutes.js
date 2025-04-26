const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

router.get('/all', companyController.getAllCompanies); // Get all companies with pagination
router.post('/', companyController.createCompany);
router.get('/:id', companyController.getCompany);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

module.exports = router;