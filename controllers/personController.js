const PersonModel = require('../models/personModel');

const PersonController = {
  async createPerson(req, res) {
    try {
      const personData = {
        ...req.body,
        CreatedByID: req.user?.id || 1 // Assuming user ID comes from auth middleware
      };
      const result = await PersonModel.managePerson('INSERT', personData);
      res.status(result.result === 1 ? 201 : 400).json(result);
    } catch (error) {
      res.status(500).json({ result: 0, message: error.message });
    }
  },

  async updatePerson(req, res) {
    try {
      const personData = {
        PersonID: req.params.id,
        ...req.body,
        CreatedByID: req.user?.id || 1
      };
      const result = await PersonModel.managePerson('UPDATE', personData);
      res.status(result.result === 1 ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({ result: 0, message: error.message });
    }
  },

  async deletePerson(req, res) {
    try {
      const personData = {
        PersonID: req.params.id,
        CreatedByID: req.user?.id || 1
      };
      const result = await PersonModel.managePerson('DELETE', personData);
      res.status(result.result === 1 ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({ result: 0, message: error.message });
    }
  },

  async getPerson(req, res) {
    try {
      const personData = {
        PersonID: req.params.id
      };
      const result = await PersonModel.managePerson('SELECT', personData);
      res.status(result.result === 1 ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({ result: 0, message: error.message });
    }
  }
};

module.exports = PersonController;