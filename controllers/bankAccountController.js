const BankAccount = require('../models/bankAccountModel');

// Get all bank accounts with optional pagination and date filters
const getAllBankAccounts = async (req, res) => {
  try {
    const { pageNumber = 1, pageSize = 10, fromDate = null, toDate = null } = req.query;

    const result = await BankAccount.getAllBankAccounts(
      parseInt(pageNumber),
      parseInt(pageSize),
      fromDate ? new Date(fromDate) : null,
      toDate ? new Date(toDate) : null
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single or all bank accounts
const getBankAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BankAccount.get(id ? parseInt(id) : null);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new bank account
const createBankAccount = async (req, res) => {
  try {
    const result = await BankAccount.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a bank account
const updateBankAccount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Bank Account ID is required' });
    }
    const result = await BankAccount.update({ ...req.body, bankAccountId: parseInt(id) });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a bank account
const deleteBankAccount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Bank Account ID is required' });
    }
    const result = await BankAccount.delete({ ...req.body, bankAccountId: parseInt(id) });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllBankAccounts,
  getBankAccount,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount
};
