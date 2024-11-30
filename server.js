const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

// Middleware para parsear el body de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'src/public')));

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cryptotrading', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexión a MongoDB establecida');
}).catch(err => {
    console.error('Error conectando a MongoDB:', err);
});

// Importar rutas
const landingRoutes = require('./src/routes/landingRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Usar rutas - El orden es importante
app.use('/servicios', serviceRoutes);  // Primero las rutas específicas
app.use('/auth', authRoutes);
app.use('/', landingRoutes);  // La ruta raíz debe ir al final

// Manejador de errores 404
app.use((req, res, next) => {
    res.status(404).render('404', {
        title: 'Página no encontrada'
    });
});

// Manejador de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
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