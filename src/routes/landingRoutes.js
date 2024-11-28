const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('landing', {
        title: "Curso de Programación 2024",
        description: "Aprende a programar desde cero con nuestro curso completo",
        video: {
            type: "youtube",
            id: "tu-video-id" // Aquí pon el ID de tu video de YouTube
        },
        features: [
            "Fundamentos de programación",
            "JavaScript moderno",
            "Desarrollo web full-stack",
            "Proyectos reales"
        ],
        ctaButton: {
            text: "¡Inscríbete ahora!",
            url: "/registro"
        }
    });
});

module.exports = router; 