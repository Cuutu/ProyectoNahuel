const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();
const connectDB = require('./src/config/database');
const { loadUser } = require('./src/middleware/auth');

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
        ttl: 24 * 60 * 60
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Middleware global para usuario
app.use(loadUser);

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Importar todas las rutas
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');

// Usar las rutas
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/servicios', serviceRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.render('landing', {
        title: 'CryptoTrading - Inicio'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;