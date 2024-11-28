const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('landing', {
        title: "Domina el Trading y las Criptomonedas",
        description: "Aprende a generar ingresos en el mercado financiero con estrategias probadas y mentorías personalizadas",
        video: {
            type: "youtube",
            id: "https://www.youtube.com/watch?v=4OVC776mrfo" // Coloca aquí el ID de tu video
        },
        features: [
            "Análisis técnico profesional",
            "Estrategias de trading probadas",
            "Gestión de riesgo y capital",
            "Señales de trading en tiempo real"
        ],
        ctaButton: {
            text: "¡Comienza Ahora!",
            url: "/registro"
        }
    });
});

module.exports = router; 