const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();
const connectDB = require('./src/config/database');

const app = express();

// Conectar a la base de datos
connectDB();

// Configuración de sesión con MongoStore
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 24 * 60 * 60 // Tiempo de vida de la sesión: 1 día
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 horas en milisegundos
    }
}));

// Middleware para pasar usuario a las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Resto de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Rutas
const serviceRoutes = require('./src/routes/serviceRoutes');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');

app.get('/', (req, res) => {
    res.render('landing', {
        title: 'CryptoTrading - Inicio'
    });
});

app.use('/servicios', serviceRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

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