const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
const connectDB = require('./src/config/database');
require('./src/config/passport');
const compression = require('compression');
// const cors = require('cors');

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
    // Debug de sesión (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
        console.log('\n=== Debug de Sesión ===');
        console.log('Path:', req.path);
        console.log('SessionID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('User:', req.user);
    }
    
    // Verificar si estamos en una ruta de vista previa o de autenticación
    const isPreviewRoute = req.path.startsWith('/preview');
    const isAuthRoute = req.path.startsWith('/auth');
    const isPublicRoute = req.path === '/' || req.path.startsWith('/public');
    
    // Establecer variables locales para las vistas
    res.locals.isPreview = isPreviewRoute;
    res.locals.isAuthRoute = isAuthRoute;
    res.locals.isPublicRoute = isPublicRoute;
    
    // Verificar autenticación
    const isUserAuthenticated = req.isAuthenticated && req.isAuthenticated() || !!req.session?.user;
    res.locals.isAuthenticated = isUserAuthenticated;
    
    // Establecer información del usuario
    if (isUserAuthenticated) {
        res.locals.user = req.user || req.session.user || null;
        
        // Renovar la sesión
        if (req.session) {
            req.session.touch();
        }
        
        // Asegurarse de que la información del usuario persista
        if (req.session && !req.session.user && req.user) {
            req.session.user = {
                id: req.user._id || req.user.id,
                nombre: req.user.nombre,
                email: req.user.email
            };
        }
    } else {
        res.locals.user = null;
    }
    
    next();
});

// Middleware para logging de todas las peticiones
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Agregar middleware para loguear todas las solicitudes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
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
const forumRoutes = require('./src/routes/forumRoutes');

// Importante: Registrar las rutas en orden de prioridad
// 1. Rutas públicas y de vista previa primero
app.use('/', previewRoutes);
app.use('/auth', authRoutes);

// 2. Rutas protegidas después
app.use('/user', userRoutes);
app.use('/alertas', alertRoutes);
app.use('/entrenamientos', trainingRoutes);
app.use('/asesorias', consultingRoutes);
app.use('/payment', paymentRoutes);
app.use('/recursos', resourceRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/cursos', cursosRoutes);
app.use('/mentoring', mentoringRoutes);

// 3. Rutas de índice al final
app.use('/', indexRoutes);

// Registrar las rutas del foro directamente en la aplicación
app.use('/', forumRoutes);

// Manejador de rutas no encontradas
app.use((req, res, next) => {
    console.log('Ruta no encontrada:', req.url);
    const error = new Error('Ruta no encontrada');
    error.status = 404;
    next(error);
});

// Agregar middleware para capturar errores
app.use((err, req, res, next) => {
    console.error('Error en la aplicación:', err);
    res.status(500).render('error', {
        message: 'Ha ocurrido un error en el servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Listar todas las rutas registradas
function listRoutes() {
    const routes = [];
    
    app._router.stack.forEach(middleware => {
        if (middleware.route) {
            // Rutas directamente registradas en la aplicación
            routes.push({
                path: middleware.route.path,
                method: Object.keys(middleware.route.methods)[0].toUpperCase()
            });
        } else if (middleware.name === 'router') {
            // Rutas registradas a través de un router
            middleware.handle.stack.forEach(handler => {
                if (handler.route) {
                    routes.push({
                        path: handler.route.path,
                        method: Object.keys(handler.route.methods)[0].toUpperCase()
                    });
                }
            });
        }
    });
    
    console.log('Rutas registradas:');
    routes.forEach(route => {
        console.log(`${route.method} ${route.path}`);
    });
}

// Llamar a la función después de registrar todas las rutas
listRoutes();

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
    console.log('Rutas disponibles:', app._router.stack
        .filter(r => r.route)
        .map(r => `${Object.keys(r.route.methods)} ${r.route.path}`));
});
module.exports = app;
