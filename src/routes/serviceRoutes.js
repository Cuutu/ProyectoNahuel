const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

// Ruta principal de servicios
router.get('/', (req, res) => {
    res.render('services', {
        title: 'Nuestros Servicios'
    });
});

// Rutas para servicios individuales
router.get('/senales-premium', (req, res) => {
    res.render('services/signals');
});

router.get('/mentoria-pro', (req, res) => {
    res.render('services/mentoring');
});

router.get('/comunidad-vip', (req, res) => {
    res.render('services/community');
});

// Rutas protegidas
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', {
        user: req.session.user
    });
});

module.exports = router; 