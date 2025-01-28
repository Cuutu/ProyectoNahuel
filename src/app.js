const express = require('express');
const app = express();

const trainingRoutes = require('./routes/training');

// Configurar las rutas
app.use('/entrenamientos', trainingRoutes);

// ... resto del código ... 