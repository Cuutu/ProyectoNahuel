const express = require('express');
const router = express.Router();
const passport = require('passport');

// Middleware para verificar si el usuario ya está autenticado
const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/recursos');
    }
    next();
};

// Aplicar el middleware a la ruta de login
router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('auth/login', {
        error: req.flash('error'),
        success: req.flash('success')
    });
});

// Ruta para autenticación con Google
router.get('/google', checkNotAuthenticated, passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback de Google
router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/recursos',
        failureRedirect: '/auth/login',
        failureFlash: true
    })
);

module.exports = router; 