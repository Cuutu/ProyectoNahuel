const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
const connectDB = require('./src/config/database');
require('./src/config/passport');

const app = express();

// Conectar a la base de datos
connectDB();

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'tu_secreto_seguro',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 24 * 60 * 60,
        autoRemove: 'native',
        touchAfter: 24 * 3600
    }),
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax'
    },
    name: 'sessionId'
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Middleware global para persistencia de sesión
app.use((req, res, next) => {
    // Debug
    console.log('\n=== Debug de Sesión ===');
    console.log('SessionID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('IsAuthenticated:', req.isAuthenticated());
    console.log('User:', req.user);
    
    // Establecer variables globales para las vistas
    res.locals.user = req.user || req.session.user;
    res.locals.isAuthenticated = req.isAuthenticated() || !!req.session.user;
    
    next();
});

// Rutas
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/dashboardRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const trainingRoutes = require('./src/routes/trainingRoutes');

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/servicios', serviceRoutes);
app.use('/entrenamientos', trainingRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.render('landing', { user: req.user });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', {
        message: 'Ha ocurrido un error en el servidor',
        error: process.env.NODE_ENV === 'development' ? err : {},
        user: req.user
    });
});

// El puerto solo se usa en desarrollo
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
}

module.exports = app;