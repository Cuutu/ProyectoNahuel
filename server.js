const express = require('express');
const path = require('path');
const app = express();

// Configuración básica
app.use(express.static('src/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Ruta simple
app.get('/', (req, res) => {
    res.render('landing', {
        title: "Mi Landing Page",
        description: "Una descripción simple",
        video: {
            id: "dQw4w9WgXcQ" // ID de ejemplo de YouTube
        },
        features: ["Feature 1", "Feature 2", "Feature 3"],
        ctaButton: {
            text: "¡Comenzar!",
            url: "/registro"
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 