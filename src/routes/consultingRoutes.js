const express = require('express');
const router = express.Router();

// Ruta principal de asesorías
router.get('/', (req, res) => {
    res.render('asesorias', {
        title: 'Asesorías',
        user: req.user || req.session.user,
        isAuthenticated: req.isAuthenticated() || !!req.session.user
    });
});

// Ruta para consultorio financiero
router.get('/consultorio-financiero', (req, res) => {
    res.render('asesorias/consultorio', {
        title: 'Consultorio Financiero',
        user: req.user || req.session.user,
        isAuthenticated: req.isAuthenticated() || !!req.session.user
    });
});

// Ruta para cuenta asesorada
router.get('/cuenta-asesorada', (req, res) => {
    res.render('asesorias/cuenta', {
        title: 'Cuenta Asesorada',
        user: req.user || req.session.user,
        isAuthenticated: req.isAuthenticated() || !!req.session.user
    });
});

module.exports = router; 