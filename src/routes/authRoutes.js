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
        title: 'Login - CryptoTrading',
        returnTo: req.query.returnTo || '/user/dashboard'
    });
});

router.post('/login', authController.login);

// Ruta de logout simplificada
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) { 
            console.error('Error al cerrar sesión:', err);
        }
        res.redirect('/');
    });
});

// Verificar si las variables de entorno para Google OAuth están disponibles
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL) {
    // Rutas de Google OAuth
    router.get('/google',
        passport.authenticate('google', { 
            scope: ['profile', 'email']
        })
    );

    // Ruta de callback de Google
    router.get('/google/callback', 
        passport.authenticate('google', { 
            failureRedirect: '/auth/login',
            successRedirect: '/user/dashboard'
        })
    );
} else {
    // Ruta alternativa si Google OAuth no está configurado
    router.get('/google', (req, res) => {
        console.log('Intento de autenticación con Google, pero no está configurado');
        res.redirect('/auth/login?error=google_auth_not_available');
    });
}

module.exports = router; 