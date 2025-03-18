const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const cashflowController = require('../controllers/cashflowController');

// Ruta principal de Cashflow (simplificada)
router.get('/', isAuthenticated, cashflowController.getDashboard);

// Aquí puedes agregar más rutas específicas para Cashflow
// Por ejemplo: estadísticas, informes, etc.

module.exports = router; 