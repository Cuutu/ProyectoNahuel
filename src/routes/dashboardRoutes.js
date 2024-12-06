const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, (req, res) => {
    res.render('user/dashboard', {
        user: req.user,
        title: 'Mi Perfil - CryptoTrading'
    });
});

module.exports = router; 