const express = require('express');
const path = require('path');
require('dotenv').config();
const connectDB = require('./src/config/database');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

// Middleware para verificar el estado de la conexión
app.use(async (req, res, next) => {
    if (!mongoose.connection.readyState) {
        try {
            await connectDB();
        } catch (error) {
            console.error('Error reconectando a DB:', error);
        }
    }
    next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Importar rutas
const serviceRoutes = require('./src/routes/serviceRoutes');
const authRoutes = require('./src/routes/authRoutes');
const testRoutes = require('./src/routes/testRoutes');

// Ruta principal
app.get('/', async (req, res) => {
    try {
        console.log('Renderizando landing page...');
        return res.render('landing', {
            title: 'CryptoTrading - Inicio',
            taButton: {
                url: '/servicios'
            }
        });
    } catch (error) {
        console.error('Error al renderizar landing:', error);
        return res.status(500).render('error', {
            message: 'Error al cargar la página principal'
        });
    }
});

// Rutas de servicios y auth
app.use('/servicios', serviceRoutes);
app.use('/auth', authRoutes);
app.use('/api', testRoutes);

// Rutas adicionales
app.get('/entrenamientos', (req, res) => {
    res.render('training', {
        title: 'Entrenamientos'
    });
});

app.get('/asesoramientos', (req, res) => {
    res.render('consulting', {
        title: 'Asesoramientos'
    });
});

app.get('/mentoring', (req, res) => {
    res.render('mentoring', {
        title: 'Mentoring'
    });
});

app.get('/recursos', (req, res) => {
    res.render('resources', {
        title: 'Recursos'
    });
});

// Manejador de errores 404
app.use((req, res) => {
    console.log('404 - Ruta no encontrada:', req.url);
    res.status(404).render('404', {
        title: 'Página no encontrada'
    });
});

// Manejador de errores
app.use((err, req, res, next) => {
    console.error('Error en la aplicación:', err);
    res.status(500).render('error', {
        title: 'Error',
        message: 'Hubo un error en el servidor'
    });
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Servidor corriendo en puerto ${PORT}`);
    } catch (error) {
        console.error('Error inicial conectando a DB:', error);
    }
});

module.exports = app;