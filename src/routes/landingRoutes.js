const express = require('express');
const router = express.Router();

// Ruta para la página principal (landing)
router.get('/', (req, res) => {
    res.render('landing', {
        title: 'CryptoTrading - Tu plataforma de trading',
        description: 'Aprende a operar en el mercado de criptomonedas con expertos'
    });
});

module.exports = router; 