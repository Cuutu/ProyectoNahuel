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

// Middleware para logging de todas las peticiones
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Rutas
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/dashboardRoutes');
const alertRoutes = require('./src/routes/alertRoutes');
const trainingRoutes = require('./src/routes/trainingRoutes');
const consultingRoutes = require('./src/routes/consultingRoutes');
const resourceRoutes = require('./src/routes/resourceRoutes');
const apiRoutes = require('./src/routes/apiRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const mentoringRoutes = require('./src/routes/mentoring');
const cursosRoutes = require('./src/routes/cursosRoutes');
const indexRoutes = require('./src/routes/index');
const previewRoutes = require('./src/routes/previewRoutes');

// Importante: Registrar las rutas de vista previa ANTES de las otras rutas
app.use('/', previewRoutes);

app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/alertas', alertRoutes);
app.use('/entrenamientos', trainingRoutes);
app.use('/asesorias', consultingRoutes);
app.use('/payment', paymentRoutes);
app.use('/recursos', resourceRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/cursos', cursosRoutes);
app.use('/', indexRoutes);

// Manejador de rutas no encontradas
app.use((req, res, next) => {
    console.log('Ruta no encontrada:', req.url);
    const error = new Error('Ruta no encontrada');
    error.status = 404;
    next(error);
});

// Manejador de errores
app.use((err, req, res, next) => {
    console.error('Error completo:', {
        message: err.message,
        stack: err.stack,
        status: err.status || 500
    });

    res.status(err.status || 500);
    res.render('error', {
        message: process.env.NODE_ENV === 'development' 
            ? `Error: ${err.message}\n${err.stack}` 
            : 'Ha ocurrido un error en el servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
    console.log('Rutas disponibles:', app._router.stack
        .filter(r => r.route)
        .map(r => `${Object.keys(r.route.methods)} ${r.route.path}`));
});
module.exports = app;
