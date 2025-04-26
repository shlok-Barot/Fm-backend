const Certification = require('../models/certificationModel');

// Get all certifications
const getAllCertifications = async (req, res) => {
  try {
    const { pageNumber = 1, pageSize = 10, fromDate, toDate } = req.query;
    const result = await Certification.getAll(
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

// Get single certification
const getCertification = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error('Certification ID is required');
    }
    const result = await Certification.get(parseInt(id));
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes('required') ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
};

// Create a new certification
const createCertification = async (req, res) => {
  try {
    const { certificationName, createdById } = req.body;
    if (!certificationName || !createdById) {
      throw new Error('Certification name and created by ID are required');
    }
    const result = await Certification.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    const status = err.message.includes('required') ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
};

// Update a certification
const updateCertification = async (req, res) => {
  try {
    const certificationId = parseInt(req.params.id);
    const { certificationName } = req.body;
    if (!certificationName) {
      throw new Error('Certification name is required');
    }
    const result = await Certification.update({ certificationId, certificationName });
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes('required') ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
};

// Delete a certification
const deleteCertification = async (req, res) => {
  try {
    const certificationId = parseInt(req.params.id);
    const { deletedById } = req.body;
    const result = await Certification.delete({ certificationId, deletedById });
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes('required') ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
};

module.exports = {
  getAllCertifications,
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification
};