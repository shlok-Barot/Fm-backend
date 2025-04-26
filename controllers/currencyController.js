const Currency = require('../models/currencyModel');

exports.getAllCurrencies = async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null;
        const toDate = req.query.toDate ? new Date(req.query.toDate) : null;

        const result = await Currency.getAllCurrencies({ pageNumber, pageSize, fromDate, toDate });
        
        if (result.result === 0) {
            return res.status(200).json({
                data: result.data,
                message: result.message
            });
        }
        return res.status(400).json({ error: result.message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCurrency = async (req, res) => {
    try {
        const { currencyName, createdById } = req.body;
        if (!currencyName || !createdById) {
            return res.status(400).json({ error: 'currencyName and createdById are required' });
        }

        const result = await Currency.create({ currencyName, createdById });
        if (result.result === 0) {
            return res.status(201).json({ message: result.message });
        }
        return res.status(400).json({ error: result.message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCurrency = async (req, res) => {
    try {
        const { id } = req.params;
        const currencyId = id ? parseInt(id) : null;
        const result = await Currency.get(currencyId);

        if (result.result === 0) {
            if (currencyId && (!result.data || result.data.length === 0)) {
                return res.status(404).json({ error: 'Currency not found or deleted' });
            }
            return res.status(200).json(currencyId ? result.data[0] || null : result.data);
        }
        return res.status(400).json({ error: result.message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCurrency = async (req, res) => {
    try {
        const { id } = req.params;
        const { currencyName, createdById } = req.body;
        if (!currencyName || !createdById) {
            return res.status(400).json({ error: 'currencyName and createdById are required' });
        }

        const result = await Currency.update({ currencyId: parseInt(id), currencyName, createdById });
        if (result.result === 0) {
            return res.status(200).json({ message: result.message });
        }
        return res.status(400).json({ error: result.message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCurrency = async (req, res) => {
    try {
        const { id } = req.params;
        const { deletedById } = req.body;
        if (!deletedById) {
            return res.status(400).json({ error: 'deletedById is required' });
        }

        const result = await Currency.delete({ currencyId: parseInt(id), deletedById });
        if (result.result === 0) {
            return res.status(200).json({ message: result.message });
        }
        return res.status(404).json({ error: result.message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};