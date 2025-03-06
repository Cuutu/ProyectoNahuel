const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { google } = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID_2,
    process.env.GOOGLE_CLIENT_SECRET_2,
    process.env.GOOGLE_REDIRECT_URI
);

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

router.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    
    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log('Nuevo Refresh Token:', tokens.refresh_token);
        
        // Guardar el token en una variable de entorno temporal
        process.env.GOOGLE_REFRESH_TOKEN = tokens.refresh_token;
        
        res.send(`
            <h1>Autorización Exitosa</h1>
            <p>Tu refresh token es: ${tokens.refresh_token}</p>
            <p>Por favor, guarda este token en tus variables de entorno (.env)</p>
            <script>
                console.log("Refresh Token:", "${tokens.refresh_token}");
            </script>
        `);
    } catch (error) {
        console.error('Error al obtener tokens:', error);
        res.status(500).send('Error al procesar la autorización');
    }
});

module.exports = router; 