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

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy((err) => {
            if (err) { return next(err); }
            res.redirect('/');
        });
    });
});

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
    (req, res, next) => {
        console.log('Callback de Google ejecutado');
        console.log('Usuario autenticado:', req.user?._id);
        
        // Forzar guardado de sesión
        req.session.save((err) => {
            if (err) {
                console.error('Error al guardar sesión:', err);
                return next(err);
            }
            console.log('Sesión guardada correctamente');
            res.redirect('/');
        });
    }
);

module.exports = router; 