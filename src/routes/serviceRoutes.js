const express = require('express');
const router = express.Router();

router.get('/servicios', (req, res) => {
    res.render('services', {
        title: "Nuestros Servicios de Trading",
        description: "Descubre nuestros servicios premium de trading y análisis de mercado",
        video: {
            type: "youtube",
            id: "tu-id-de-youtube"
        },
        services: [
            {
                title: "Señales Premium",
                description: "Señales de trading en tiempo real con alta precisión",
                subscribers: 1500,
                features: ["24/7 Alertas", "Setup completo", "Stop Loss y Take Profit"],
                userType: "Trader Activo"
            },
            {
                title: "Mentoría Personalizada",
                description: "Sesiones one-on-one con traders expertos",
                subscribers: 500,
                features: ["Sesiones semanales", "Plan personalizado", "Soporte prioritario"],
                userType: "Trader Profesional"
            },
            {
                title: "Comunidad VIP",
                description: "Acceso a nuestra comunidad exclusiva de traders",
                subscribers: 2500,
                features: ["Chat grupal", "Webinars semanales", "Recursos exclusivos"],
                userType: "Trader Principiante"
            }
        ]
    });
});

module.exports = router; 