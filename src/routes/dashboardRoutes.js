const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

// Aplicar middleware a todas las rutas
router.use(isAuthenticated);

// Ruta principal del dashboard
router.get('/dashboard', userController.getDashboard);

module.exports = router; 