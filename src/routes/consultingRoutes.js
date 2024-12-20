const express = require('express');
const router = express.Router();
const consultingController = require('../controllers/consultingController');

// Ruta principal de asesoramientos
router.get('/', (req, res) => {
    res.render('consulting', {
        title: 'Asesoramientos - CryptoTrading',
        user: req.user || req.session.user,
        isAuthenticated: req.isAuthenticated() || !!req.session.user
    });
});

module.exports = router; 