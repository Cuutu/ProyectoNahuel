const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const methodOverride = require('method-override');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const alertRoutes = require('./routes/alertRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const consultingRoutes = require('./routes/consultingRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const apiRoutes = require('./routes/apiRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const previewRoutes = require('./routes/previewRoutes'); // Nuevas rutas de vista previa

// Inicializar la aplicación
const app = express();

// Configurar la conexión a la base de datos
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conexión a MongoDB establecida'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Configurar el motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Configurar sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 día
}));

// Configurar flash messages
app.use(flash());

// Configurar passport
app.use(passport.initialize());
app.use(passport.session());

// Variables globales
app.use((req, res, next) => {
    res.locals.user = req.user || req.session.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.isAuthenticated = req.isAuthenticated() || (req.session && req.session.user);
    next();
});

// Registrar rutas
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/alerts', alertRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/consulting', consultingRoutes);
app.use('/booking', bookingRoutes);
app.use('/api', apiRoutes);
app.use('/training', trainingRoutes);
app.use('/', previewRoutes); // Registrar rutas de vista previa

app.get('/alertas/smart-money', (req, res) => {
    res.render('alertas/smart-money');
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Página no encontrada',
        message: 'La página que estás buscando no existe',
        error: { status: 404 }
    });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        title: 'Error',
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});

module.exports = app; 