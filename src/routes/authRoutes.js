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
        failureFlash: true
    }),
    (req, res) => {
        // Asegurarse de que la sesión se guarde antes de redirigir
        req.session.save((err) => {
            if (err) {
                console.error('Error al guardar la sesión:', err);
                return res.redirect('/auth/login');
            }
            console.log('Sesión guardada correctamente');
            res.redirect('/dashboard');
        });
    }
);

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.redirect('/');
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al destruir la sesión:', err);
            }
            res.redirect('/');
        });
    });
});

module.exports = router; 