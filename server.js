const express = require('express');
const app = express();
const landingRoutes = require('./src/routes/landingRoutes');

// Configuración de archivos estáticos y vistas
app.use(express.static('src/public'));
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Rutas
app.use('/', landingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 