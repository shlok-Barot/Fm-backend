const City = require('../models/cityModel')

exports.getAllCities = async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null;
        const toDate = req.query.toDate ? new Date(req.query.toDate) : null;

        // Validate pagination parameters
        if (pageNumber < 1 || pageSize < 1) {
            return res.status(400).json({ error: 'Invalid pagination parameters' });
        }

        // Validate date parameters
        if ((fromDate && isNaN(fromDate.getTime())) || (toDate && isNaN(toDate.getTime()))) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const result = await City.getAllCities(pageNumber, pageSize, fromDate, toDate);

        if (result.result === 0) {
            return res.status(200).json({
                message: result.message,
                data: result.data,
                pagination: {
                    totalRecords: result.totalRecords,
                    pageNumber: result.pageNumber,
                    pageSize: result.pageSize,
                    totalPages: Math.ceil(result.totalRecords / result.pageSize)
                }
            });
        } else {
            return res.status(400).json({ error: result.message });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.createCity = async (req, res) => {
    try {
        const { cityName, countryId, createdById } = req.body;
        if (!cityName || !createdById) {
            return res.status(400).json({ error: 'cityName and createdById are required' });
        }

        const result = await City.create({ cityName, countryId, createdById });
        if (result.result === 0) {
            return res.status(201).json({ message: result.message });
        }
        return res.status(400).json({ error: result.message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCity = async (req, res) => {
    try {
        const { id } = req.params;
        const cityId = id ? parseInt(id) : null;
        const result = await City.get(cityId);

        if (result.result === 0) {
            if (cityId && (!result.data || result.data.length === 0)) {
                return res.status(404).json({ error: 'City not found or deleted' });
            }
            return res.status(200).json(cityId ? result.data[0] || null : result.data);
        }
        return res.status(400).json({ error: result.message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCity = async (req, res) => {
    try {
        const { id } = req.params;
        const { cityName, countryId, createdById } = req.body;
        if (!cityName || !createdById) {
            return res.status(400).json({ error: 'cityName and createdById are required' });
        }

        const result = await City.update({ cityId: parseInt(id), cityName, countryId, createdById });
        if (result.result === 0) {
            return res.status(200).json({ message: result.message });
        }
        return res.status(400).json({ error: result.message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCity = async (req, res) => {
    try {
        const { id } = req.params;
        const { deletedById } = req.body;
        if (!deletedById) {
            return res.status(400).json({ error: 'deletedById is required' });
        }

        const result = await City.delete({ cityId: parseInt(id), deletedById });
        if (result.result === 0) {
            return res.status(200).json({ message: result.message });
        }
        return res.status(404).json({ error: result.message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};