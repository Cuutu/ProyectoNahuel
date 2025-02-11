const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
const connectDB = require('./src/config/database');
require('./src/config/passport');
const compression = require('compression');

const app = express();

// Conectar a la base de datos
connectDB();

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'src', 'public'), {
    maxAge: '1y'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Configurar el middleware de sesión
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'tu_clave_secreta',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'lax'
    },
    store: new MongoStore({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 30 * 24 * 60 * 60,
        autoRemove: 'native',
        touchAfter: 24 * 3600
    })
});

// Aplicar middlewares en orden
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Middleware global para persistencia de sesión
app.use((req, res, next) => {
    // Debug de sesión
    console.log('\n=== Debug de Sesión ===');
    console.log('SessionID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('User:', req.user);
    
    // Verificar autenticación
    const isUserAuthenticated = req.isAuthenticated() || !!req.session.user;
    
    // Establecer variables locales
    res.locals.isAuthenticated = isUserAuthenticated;
    res.locals.user = req.user || req.session.user || null;
    
    // Si el usuario está autenticado, renovar la sesión
    if (isUserAuthenticated) {
        req.session.touch();
        // Asegurarse de que la información del usuario persista
        if (!req.session.user && req.user) {
            req.session.user = req.user;
        }
    }
    
    next();
});

// Rutas
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/dashboardRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const trainingRoutes = require('./src/routes/trainingRoutes');
const consultingRoutes = require('./src/routes/consultingRoutes');
const resourceRoutes = require('./src/routes/resourceRoutes');
const apiRoutes = require('./src/routes/apiRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/servicios', serviceRoutes);
app.use('/entrenamientos', trainingRoutes);
app.use('/asesoramientos', consultingRoutes);
app.use('/payment', paymentRoutes);
app.use('/recursos', resourceRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.render('landing', { user: req.user });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error('Error en servidor:', err);
    res.status(500).render('error', {
        message: 'Ha ocurrido un error en el servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
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