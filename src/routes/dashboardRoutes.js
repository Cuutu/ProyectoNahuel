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

    // Evitar bucles de redirección: no redirigir si ya estamos en la página de login
    if (req.path === '/auth/login') {
        return next();
    }

    if (req.isAuthenticated() || (req.session && req.session.user)) {
        return next();
    }
    
    // Añadir la URL original como query parameter para redirigir después del login
    const returnTo = req.originalUrl;
    res.redirect(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
};

// Aplicar middleware a todas las rutas
router.use(isAuthenticated);

// Ruta principal del dashboard
router.get('/dashboard', userController.getDashboard);

module.exports = router; 