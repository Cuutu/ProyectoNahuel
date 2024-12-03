const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');

// Ruta principal de entrenamientos
router.get('/', trainingController.getTrainings);

// Ruta para análisis técnico
router.get('/analisis-tecnico', trainingController.getAnalisisTecnico);

module.exports = router; 