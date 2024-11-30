const express = require('express');
const router = express.Router();

// Ruta para la página principal
router.get('/', (req, res) => {
    res.render('landing', {
        title: 'CryptoTrading - Tu plataforma de trading'
    });
});

// Rutas adicionales
router.get('/entrenamientos', (req, res) => {
    res.render('training', {
        title: 'Entrenamientos'
    });
});

router.get('/asesoramientos', (req, res) => {
    res.render('consulting', {
        title: 'Asesoramientos'
    });
});

router.get('/mentoring', (req, res) => {
    res.render('mentoring', {
        title: 'Mentoring'
    });
});

router.get('/recursos', (req, res) => {
    res.render('resources', {
        title: 'Recursos'
    });
});

module.exports = router; 