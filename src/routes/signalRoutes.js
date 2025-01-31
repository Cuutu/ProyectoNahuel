const express = require('express');
const router = express.Router();
const signalController = require('../controllers/signalController');
const { isAdmin } = require('../middleware/auth');

// Rutas protegidas por admin
router.post('/signals', isAdmin, signalController.createSignal);
router.put('/signals/:id', isAdmin, signalController.updateSignalStatus);

// Ruta pública (pero verificará suscripción en el middleware)
router.get('/signals', signalController.getActiveSignals);

module.exports = router; 