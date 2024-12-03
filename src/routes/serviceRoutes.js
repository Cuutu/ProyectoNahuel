const express = require('express');
const router = express.Router();

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

module.exports = router; 