const express = require('express');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Configuración de sesión usando la variable de entorno
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

// Middleware para pasar usuario a las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// ... resto de la configuración