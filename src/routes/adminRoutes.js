const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

// Middleware para verificar que el usuario es administrador
router.use(isAdmin);

// Rutas del panel de administración
router.get('/dashboard', adminController.getDashboard);

module.exports = router; 