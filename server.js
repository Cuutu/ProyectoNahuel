const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Importar rutas
const landingRoutes = require('./src/routes/landingRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Usar rutas
app.use('/', landingRoutes);  // La ruta principal debe ir primero
app.use('/servicios', serviceRoutes);
app.use('/auth', authRoutes);

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
    res.status(404).render('404', {
        title: 'Página no encontrada'
    });
});

// Manejador de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', {
        title: 'Error',
        message: 'Hubo un error en el servidor'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;