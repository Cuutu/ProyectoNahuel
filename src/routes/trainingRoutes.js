const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');

router.get('/', trainingController.getTrainings);
router.get('/:slug', trainingController.getTrainingDetail);

module.exports = router; 