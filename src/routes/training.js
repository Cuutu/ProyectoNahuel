const express = require('express');
const router = express.Router();

// Ruta para la página principal de entrenamientos
router.get('/', (req, res) => {
    res.render('training');
});

// Ruta para análisis técnico
router.get('/analisis-tecnico', (req, res) => {
    res.render('training/analisis-tecnico');
});

// Ruta para trading avanzado
router.get('/trading-avanzado', (req, res) => {
    res.render('training/trading-avanzado');
});

// Ruta para trading profesional
router.get('/trading-profesional', (req, res) => {
    res.render('training/trading-profesional');
});

module.exports = router; 