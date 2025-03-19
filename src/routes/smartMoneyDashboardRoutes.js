const express = require('express');
const router = express.Router();
const hasSmartMoneySubscription = require('../middleware/smartMoneySubscription');

// Aplicar el middleware de suscripción a todas las rutas
router.use(hasSmartMoneySubscription);

// Ruta principal del dashboard
router.get('/dashboard/smart-money', (req, res) => {
    const user = req.user || req.session.user;
    
    res.render('dashboard/smart-money/index', {
        user: user,
        title: 'Dashboard Smart Money - Mentoría Personalizada',
        isAuthenticated: true,
        currentPath: req.path
    });
});

// Ruta para solicitar mentoría
router.get('/dashboard/smart-money/solicitar-mentoria', (req, res) => {
    const user = req.user || req.session.user;
    
    res.render('dashboard/smart-money/solicitar-mentoria', {
        user: user,
        title: 'Solicitar Mentoría - Smart Money',
        isAuthenticated: true,
        currentPath: req.path
    });
});

// Ruta para material exclusivo
router.get('/dashboard/smart-money/material-exclusivo', (req, res) => {
    const user = req.user || req.session.user;
    
    res.render('dashboard/smart-money/material-exclusivo', {
        user: user,
        title: 'Material Exclusivo - Smart Money',
        isAuthenticated: true,
        currentPath: req.path
    });
});

// Ruta para historial de mentorías
router.get('/dashboard/smart-money/historial', (req, res) => {
    const user = req.user || req.session.user;
    
    res.render('dashboard/smart-money/historial', {
        user: user,
        title: 'Historial de Mentorías - Smart Money',
        isAuthenticated: true,
        currentPath: req.path
    });
});

module.exports = router; 