const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certificationController');

router.get('/', certificationController.getAllCertifications);
router.get('/:id', certificationController.getCertification);
router.post('/', certificationController.createCertification);
router.put('/:id', certificationController.updateCertification);
router.delete('/:id', certificationController.deleteCertification);

module.exports = router;