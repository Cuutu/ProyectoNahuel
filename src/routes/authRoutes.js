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
        session: true
    }),
    (req, res, next) => {
        if (!req.user) {
            return res.redirect('/auth/login');
        }

        req.session.regenerate((err) => {
            if (err) {
                console.error('Error regenerando sesión:', err);
                return next(err);
            }

            req.session.user = req.user;
            req.session.isAuthenticated = true;

            req.session.save((err) => {
                if (err) {
                    console.error('Error guardando sesión:', err);
                    return next(err);
                }
                console.log('Estado de la sesión después de login:', {
                    sessionID: req.sessionID,
                    isAuthenticated: req.session.isAuthenticated,
                    user: req.session.user
                });
                res.redirect('/dashboard');
            });
        });
    }
);

// Ruta para cerrar sesión
router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router; 