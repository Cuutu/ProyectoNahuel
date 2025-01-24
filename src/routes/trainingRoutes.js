const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');
const { sessionPersist } = require('../middleware/auth');

// Aplicar middleware a todas las rutas de entrenamiento
router.use(sessionPersist);

router.get('/', trainingController.getTrainings);
router.get('/analisis-tecnico', trainingController.getAnalisisTecnico);

router.get('/trading-avanzado', (req, res) => {
    res.render('training/trading-avanzado', {
        title: 'Trading Avanzado',
        user: req.user
    });
});

module.exports = router; 