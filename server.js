const express = require('express');
const path = require('path');
require('dotenv').config();
const connectDB = require('./src/config/database');

const app = express();

// Middleware básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Importar rutas
const serviceRoutes = require('./src/routes/serviceRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Ruta principal
app.get('/', async (req, res) => {
    try {
        return res.render('landing', {
            title: 'CryptoTrading - Inicio'
        });
    } catch (error) {
        console.error('Error al renderizar landing:', error);
        return res.status(500).render('error', {
            message: 'Error al cargar la página principal'
        });
    }
});

// Usar rutas
app.use('/servicios', serviceRoutes);
app.use('/auth', authRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).render('error', {
        message: 'Página no encontrada'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;