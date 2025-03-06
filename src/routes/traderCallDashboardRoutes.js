const express = require('express');
const router = express.Router();

// Middleware de autenticación y verificación de suscripción
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() || (req.session && req.session.user)) {
        return next();
    }
    res.redirect('/auth/login');
};

// Middleware para verificar si el usuario tiene una suscripción activa a Trader Call
const hasTraderCallSubscription = (req, res, next) => {
    const user = req.user || (req.session && req.session.user);
    
    // Verificar si el usuario tiene una suscripción activa a Trader Call
    // Comprobar según el modelo de usuario
    if (user && user.membresias && 
        (user.membresias.alertas === 'premium' || user.membresias.alertas === 'pro') && 
        user.membresias.vencimientoAlertas && new Date(user.membresias.vencimientoAlertas) > new Date()) {
        return next();
    }
    
    // Si no tiene suscripción, redirigir a la página de suscripción
    res.redirect('/alertas/trader-call?subscription=required');
};

// Aplicar middleware a todas las rutas
router.use(isAuthenticated);
router.use(hasTraderCallSubscription);

// Ruta principal del dashboard de Trader Call
router.get('/dashboard/trader-call', (req, res) => {
    const user = req.user || req.session.user;
    
    res.render('dashboard/trader-call/index', {
        user: user,
        title: 'Dashboard Trader Call - Nahuel Lozano',
        isAuthenticated: true
    });
});

// Ruta para el seguimiento de alertas
router.get('/dashboard/trader-call/seguimiento', (req, res) => {
    const user = req.user || req.session.user;
    
    res.render('dashboard/trader-call/seguimiento', {
        user: user,
        title: 'Seguimiento de Alertas - Trader Call',
        isAuthenticated: true
    });
});

// Ruta para las alertas vigentes
router.get('/dashboard/trader-call/alertas-vigentes', (req, res) => {
    const user = req.user || req.session.user;
    
    res.render('dashboard/trader-call/alertas-vigentes', {
        user: user,
        title: 'Alertas Vigentes - Trader Call',
        isAuthenticated: true
    });
});

// Ruta para los informes
router.get('/dashboard/trader-call/informes', (req, res) => {
    const user = req.user || req.session.user;
    
    res.render('dashboard/trader-call/informes', {
        user: user,
        title: 'Informes - Trader Call',
        isAuthenticated: true
    });
});

// Ruta para la comunidad
router.get('/dashboard/trader-call/comunidad', (req, res) => {
    const user = req.user || req.session.user;
    
    res.render('dashboard/trader-call/comunidad', {
        user: user,
        title: 'Comunidad - Trader Call',
        isAuthenticated: true
    });
});

module.exports = router; 