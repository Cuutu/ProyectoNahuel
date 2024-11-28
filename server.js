const express = require('express');
const path = require('path');
const app = express();

// Configuración de archivos estáticos - usando la ruta correcta
app.use(express.static(path.join(__dirname, 'src/public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Rutas
app.get('/', (req, res) => {
    res.render('landing', {
        title: "Domina el Trading y las Criptomonedas",
        description: "Aprende a generar ingresos en el mercado financiero con estrategias probadas y mentorías personalizadas",
        video: {
            id: "tu-id-de-youtube"
        },
        ctaButton: {
            url: "#unirme",
            text: "¡Unirme Ahora!"
        }
    });
});

const serviceRoutes = require('./src/routes/serviceRoutes');

app.use('/', serviceRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 