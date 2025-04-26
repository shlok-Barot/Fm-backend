const CountryOfOrigin = require('../models/countryOfOriginModel');

exports.createCountryOfOrigin = async (req, res) => {
    try {
        const { countryOfOrigin, createdById } = req.body;
        if (!countryOfOrigin || !createdById) {
            return res.status(400).json({ error: 'countryOfOrigin and createdById are required' });
        }

        const result = await CountryOfOrigin.create({ countryOfOrigin, createdById });
        if (result.result === 0) {
            return res.status(201).json({ message: result.message });
        }
        return res.status(400).json({ error: result.message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCountryOfOrigin = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await CountryOfOrigin.get(id ? parseInt(id) : null);
        if (result.result === 0) {
            return res.status(200).json(id ? result.data[0] || null : result.data);
        }
        return res.status(404).json({ error: result.message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllCountriesOfOrigin = async (req, res) => {
  try {
    const { pageNumber = 1, pageSize = 10, fromDate, toDate } = req.query;
    const result = await CountryOfOrigin.getAll(
      parseInt(pageNumber),
      parseInt(pageSize),
      fromDate,
      toDate
    );
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes('required') ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
};

exports.updateCountryOfOrigin = async (req, res) => {
    try {
        const { id } = req.params;
        const { countryOfOrigin, createdById } = req.body;
        if (!countryOfOrigin || !createdById) {
            return res.status(400).json({ error: 'countryOfOrigin and createdById are required' });
        }

        const result = await CountryOfOrigin.update({ countryOfOriginId: parseInt(id), countryOfOrigin, createdById });
        if (result.result === 0) {
            return res.status(200).json({ message: result.message });
        }
        return res.status(400).json({ error: result.message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCountryOfOrigin = async (req, res) => {
    try {
        const { id } = req.params;
        const { deletedById } = req.body;
        if (!deletedById) {
            return res.status(400).json({ error: 'deletedById is required' });
        }

        const result = await CountryOfOrigin.delete({ countryOfOriginId: parseInt(id), deletedById });
        if (result.result === 0) {
            return res.status(200).json({ message: result.message });
        }
        return res.status(404).json({ error: result.message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};