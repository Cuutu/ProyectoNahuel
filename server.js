const express = require('express');
const path = require('path');
const app = express();

// Configuración de archivos estáticos - usando la ruta correcta
app.use(express.static(path.join(__dirname, 'src/public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Rutas
const landingRoutes = require('./src/routes/landingRoutes');
app.use('/', landingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 