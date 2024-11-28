const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public'));

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto',
    resave: false,
    saveUninitialized: false
}));

// Conexión a la base de datos
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/tu_base_de_datos')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas (las importaremos más adelante)
// app.use('/', require('./src/routes/landingRoutes'));
// app.use('/membership', require('./src/routes/membershipRoutes'));
// app.use('/auth', require('./src/routes/authRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 