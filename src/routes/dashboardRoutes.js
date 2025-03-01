const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Middleware de autenticación
const isAuthenticated = (req, res, next) => {
    console.log('Auth Check:', {
        session: !!req.session,
        sessionUser: !!req.session?.user,
        user: !!req.user,
        isAuthenticated: req.isAuthenticated()
    });

    if (req.isAuthenticated() || (req.session && req.session.user)) {
        return next();
    }
    res.redirect('/auth/login');
};

// Aplicar middleware a todas las rutas
router.use(isAuthenticated);

// Ruta principal del dashboard
router.get('/dashboard', userController.getDashboard);

module.exports = router; 