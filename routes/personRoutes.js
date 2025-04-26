const express = require('express');
const PersonController = require('../controllers/personController');

const router = express.Router();

// Validation middleware
const validatePersonData = (req, res, next) => {
  const { FirstName, LastName, LoginID } = req.body;
  if (req.method === 'POST' && (!FirstName || !LastName || !LoginID)) {
    return res.status(400).json({
      result: 2,
      message: 'FirstName, LastName, and LoginID are required for INSERT'
    });
  }
  next();
};

// Routes
router.post('/', validatePersonData, PersonController.createPerson);
router.put('/:id', PersonController.updatePerson);
router.delete('/:id', PersonController.deletePerson);
router.get('/:id', PersonController.getPerson);

module.exports = router;