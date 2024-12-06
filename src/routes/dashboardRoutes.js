const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Middleware de autenticación
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};

// Aplicar middleware a todas las rutas
router.use(isAuthenticated);

// Ruta principal del dashboard
router.get('/', userController.getDashboard);

module.exports = router; 