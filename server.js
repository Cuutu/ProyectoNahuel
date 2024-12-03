const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();
const connectDB = require('./src/config/database');

const app = express();

// Configuración básica de sesión
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Middleware para pasar el usuario a las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Resto de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Conectar a la base de datos
connectDB();

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Importar rutas
const serviceRoutes = require('./src/routes/serviceRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Ruta principal
app.get('/', (req, res) => {
    res.render('landing', {
        title: 'CryptoTrading - Inicio'
    });
});

// Usar rutas
app.use('/servicios', serviceRoutes);
app.use('/auth', authRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).render('error', {
        message: 'Página no encontrada'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;