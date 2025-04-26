const express = require('express');
const router = express.Router();
const bankAccountController = require('../controllers/bankAccountController');

router.get('/', bankAccountController.getAllBankAccounts);          // GET with pagination
router.get('/:id?', bankAccountController.getBankAccount);         // GET single or all
router.post('/', bankAccountController.createBankAccount);         // POST create
router.put('/:id', bankAccountController.updateBankAccount);          // PUT update
router.delete('/:id', bankAccountController.deleteBankAccount);       // DELETE

module.exports = router;
