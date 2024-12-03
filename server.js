const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();

// Configuración de sesión para entorno serverless
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 60 * 60 * 24 // 1 día
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 día
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
}));

// Middleware para pasar usuario a las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// ... resto de la configuración