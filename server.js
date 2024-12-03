const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();
const connectDB = require('./src/config/database');
const { loadUser } = require('./src/middleware/auth');
const sessionCheck = require('./src/middleware/sessionCheck');

const app = express();

// Conectar a la base de datos
connectDB();

// Configuración de sesión actualizada
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto_seguro',
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 24 * 60 * 60,
        autoRemove: 'native'
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
    },
    name: 'cryptoTrading'
}));

// Middleware para manejar la sesión en todas las rutas
app.use((req, res, next) => {
    if (req.session) {
        req.session.touch();
    }
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('Cookies:', req.cookies);
    next();
});

// Middleware para pasar usuario a las vistas
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
const trainingRoutes = require('./src/routes/trainingRoutes');

// Usar las rutas
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/servicios', serviceRoutes);
app.use('/entrenamientos', trainingRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.render('landing', {
        title: 'CryptoTrading - Inicio'
    });
});

app.use(sessionCheck);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;