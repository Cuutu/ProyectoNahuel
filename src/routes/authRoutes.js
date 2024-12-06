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
        // Asegurarnos de que el usuario se guarde en la sesión
        req.session.user = {
            id: req.user._id,
            nombre: req.user.nombre,
            email: req.user.email
        };
        
        // Guardar la sesión explícitamente
        req.session.save((err) => {
            if (err) {
                console.error('Error al guardar la sesión:', err);
                return res.redirect('/auth/login');
            }
            // Redirigir al dashboard o a la página anterior
            const returnTo = req.session.returnTo || '/dashboard';
            delete req.session.returnTo;
            res.redirect(returnTo);
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
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    });
});

module.exports = router; 