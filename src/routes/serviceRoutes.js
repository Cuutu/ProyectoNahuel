const express = require('express');
const router = express.Router();

// Rutas existentes
router.get('/servicios', (req, res) => {
    res.render('services', {
        title: "Nuestros Servicios"
    });
});

// Rutas para servicios individuales
router.get('/servicios/senales-premium', (req, res) => {
    res.render('services/signals');
});

router.get('/servicios/mentoria-pro', (req, res) => {
    res.render('services/mentoring');
});

router.get('/servicios/comunidad-vip', (req, res) => {
    res.render('services/community');
});

module.exports = router; 