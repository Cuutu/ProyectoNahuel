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
    (req, res) => {
        if (!req.user) {
            return res.redirect('/auth/login');
        }
        
        req.session.regenerate((err) => {
            if (err) {
                console.error('Error regenerando sesión:', err);
                return res.redirect('/auth/login');
            }
            
            req.session.user = req.user;
            req.session.save((err) => {
                if (err) {
                    console.error('Error guardando sesión:', err);
                    return res.redirect('/auth/login');
                }
                res.redirect('/');
            });
        });
    }
);

module.exports = router; 