const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// Rutas de registro
router.get('/register', (req, res) => {
    res.render('auth/register', {
        title: 'Registro - CryptoTrading'
    });
});

router.post('/register', authController.register);

// Rutas de login
router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: 'Login - CryptoTrading'
    });
});

router.post('/login', authController.login);

router.post('/logout', authController.logout);

// Rutas de Google OAuth
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email']
    })
);

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/auth/login',
        successRedirect: '/dashboard'
    })
);

module.exports = router; 