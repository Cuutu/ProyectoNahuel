const express = require('express');
const path = require('path');
const app = express();

// Configuración básica
app.use(express.static('src/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Importar rutas
const landingRoutes = require('./src/routes/landingRoutes');

// Usar rutas
app.use('/', landingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 