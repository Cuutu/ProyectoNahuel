const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');
const { isAuthenticated } = require('../middleware/auth');

// Ruta principal de entrenamientos
router.get('/', trainingController.getTrainings);

// Ruta para detalles de un entrenamiento específico
router.get('/:id', isAuthenticated, trainingController.getTrainingDetail);

// Ruta para detalles del análisis técnico
router.get('/analisis-tecnico', trainingController.getAnalisisTecnico);

module.exports = router; 