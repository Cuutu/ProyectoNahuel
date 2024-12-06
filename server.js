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

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto_seguro',
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 24 * 60 * 60,
        autoRemove: 'native',
        touchAfter: 24 * 3600
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Inicializar Passport después de la sesión
app.use(passport.initialize());
app.use(passport.session());

// Middleware para verificar el estado de la sesión
app.use((req, res, next) => {
    // Hacer el usuario disponible en todas las vistas
    res.locals.user = req.user;
    res.locals.isAuthenticated = req.isAuthenticated();
    
    // Debug de sesión
    console.log('Estado de la sesión:', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user ? {
            id: req.user._id,
            nombre: req.user.nombre,
            email: req.user.email
        } : null
    });
    next();
});

// Rutas
const authRoutes = require('./src/routes/authRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

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