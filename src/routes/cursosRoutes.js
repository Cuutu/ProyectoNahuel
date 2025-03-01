const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('cursos', {
        title: 'Cursos - CryptoTrading',
        user: req.user || req.session.user,
        isAuthenticated: req.isAuthenticated() || !!req.session.user
    });
});

module.exports = router; 