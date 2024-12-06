const express = require('express');
const router = express.Router();
const passport = require('passport');

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

// Ruta para iniciar autenticación con Google
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email']
    })
);

// Callback URL para Google
router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/auth/login',
        successRedirect: '/dashboard'
    })
);

module.exports = router; 